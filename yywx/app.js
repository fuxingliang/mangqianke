let baseFont=16
const statusEl=document.getElementById('status')
const lessonListEl=document.getElementById('lesson-list')
const lessonTitleEl=document.getElementById('lesson-title')
const lessonContentEl=document.getElementById('lesson-content')
const tabs=[...document.querySelectorAll('.tab')]
const panels={
 lesson:document.getElementById('panel-lesson'),
 practice:document.getElementById('panel-practice'),
 wrong:document.getElementById('panel-wrong'),
 exam:document.getElementById('panel-exam')
}
const practice={
 titleEl:document.getElementById('practice-title'),
 stemEl:document.getElementById('practice-stem'),
 optsEl:document.getElementById('practice-options'),
 feedbackEl:document.getElementById('practice-feedback'),
 nextBtn:document.getElementById('practice-next'),
 ratingSel:document.getElementById('practice-rating'),
 commentEl:document.getElementById('practice-comment'),
 saveEvalBtn:document.getElementById('practice-save'),
 evalBox:document.getElementById('practice-eval'),
 summaryEl:document.getElementById('practice-summary')
}
const wrong={
 refreshBtn:document.getElementById('wrong-refresh'),
 titleEl:document.getElementById('wrong-title'),
 stemEl:document.getElementById('wrong-stem'),
 optsEl:document.getElementById('wrong-options'),
 feedbackEl:document.getElementById('wrong-feedback'),
 nextBtn:document.getElementById('wrong-next'),
 summaryEl:document.getElementById('wrong-summary')
}
const exam={
 titleEl:document.getElementById('exam-title'),
 infoEl:document.getElementById('exam-info'),
 prevBtn:document.getElementById('exam-prev'),
 nextBtn:document.getElementById('exam-next'),
 submitBtn:document.getElementById('exam-submit'),
 pageEl:document.getElementById('exam-page'),
 pagesEl:document.getElementById('exam-pages')
}
const LESSONS=[
 {id:'A1_阴阳与五行',title:'A1 阴阳与五行',file:'A1_阴阳与五行.md',quiz:'basic_wuxing_plus.json'},
 {id:'A2_天干基础',title:'A2 天干基础',file:'A2_天干基础.md',quiz:'basic_ganzhi_100.json'},
 {id:'A3_地支与藏干',title:'A3 地支与藏干',file:'A3_地支与藏干.md',quiz:'basic_ganzhi_100.json'},
 {id:'A4_60花甲子',title:'A4 60 花甲子',file:'A4_60花甲子.md',quiz:'sixty_jiazi_60.json'},
 {id:'A5_五虎遁与五鼠遁',title:'A5 五虎遁 · 五鼠遁',file:'A5_五虎遁与五鼠遁.md',quiz:'five_tiger_five_mouse_60.json'},
 {id:'A6_寻根基问出处',title:'A6 寻根基问出处',file:'A6_寻根基问出处.md',quiz:'roots_and_origins_60.json'},
 {id:'A7_秩序和顺序',title:'A7 秩序和顺序',file:'A7_秩序和顺序.md',quiz:'order_and_sequence_60.json'},
 {id:'A8_十天干寄宫',title:'A8 十天干寄宫',file:'A8_十天干寄宫.md',quiz:'ten_stems_lu_palace_60.json'},
 {id:'A9_地支本意（后天八卦）',title:'A9 地支本意（后天八卦）',file:'A9_地支本意（后天八卦）.md',quiz:'branches_houtian_bagua_60.json'},
 {id:'B6_十神与映射',title:'B6 十神与映射',file:'B6_十神与映射.md',quiz:'ten_gods_100.json'},
 {id:'B7_五行分位与纳音',title:'B7 五行分位与纳音',file:'B7_五行分位与纳音.md',quiz:'five_elements_mapping_100.json'}
]
const PATHS={lessons:'./lessons/',quizzes:'./quizzes/',assets:'./assets/'}
const store={
 get:(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},
 set:(k,v)=>{localStorage.setItem(k,JSON.stringify(v))}
}
let currentLesson=null
let currentQuiz=null
let engine=null
let wrongEngine=null
let examQuiz=null
let examQuestions=[]
let examPageSize=10
let examPageIndex=0
function setFontSize(size){baseFont=Math.max(12,Math.min(22,size));document.documentElement.style.fontSize=baseFont+'px'}
function setStatus(msg){statusEl.textContent=msg||''}
function switchTab(key){tabs.forEach(t=>t.classList.toggle('active',t.dataset.tab===key));Object.keys(panels).forEach(k=>panels[k].classList.toggle('active',k===key))}
function renderLessonList(){lessonListEl.innerHTML='';LESSONS.forEach(ls=>{const li=document.createElement('li');li.textContent=ls.title;li.dataset.id=ls.id;li.onclick=()=>onLessonSelected(ls);lessonListEl.appendChild(li)})}
async function loadMarkdown(path){try{const r=await fetch(path);if(!r.ok){lessonContentEl.innerHTML='未找到课程文件';return}let txt=await r.text();txt=txt.replace(/\((\.?\/)?assets\//g,'(../assets/');lessonTitleEl.textContent=path.split('/').pop();lessonContentEl.innerHTML=marked.parse(txt)}catch(e){lessonContentEl.innerHTML='加载失败'}}
function onLessonSelected(ls){currentLesson=ls;switchTab('lesson');loadMarkdown(PATHS.lessons+ls.file);setStatus('已加载：'+ls.title+' | 练习：'+ls.quiz);preparePractice(ls.quiz);prepareExam(ls.quiz)}
async function loadQuiz(file){try{const r=await fetch(PATHS.quizzes+file);if(!r.ok)return null;const data=await r.json();return data}catch(e){return null}}
function createEngine(quiz){return{
 quiz,idx:0,score:0,answered:0,total:quiz?quiz.questions.length:0,answers:[],
 current(){if(!this.quiz||this.idx>=this.quiz.questions.length)return null;return this.quiz.questions[this.idx]},
 check(selected){const q=this.current();if(!q)return false;const ok=JSON.stringify(selected)===JSON.stringify(q.answer);this.answered+=1;this.answers.push({id:q.id,sel:selected,ok});return ok},
 next(){if(this.idx<this.total)this.idx+=1},
 stats(){return{answered:this.answered,score:this.score,wrong:Math.max(0,this.answered-this.score),total:this.total}}
}}
function renderPracticeQuestion(e){const q=e.current();if(!q){practice.stemEl.textContent='练习已结束';practice.optsEl.innerHTML='';practice.feedbackEl.textContent='';practice.evalBox.style.display='none';practice.summaryEl.textContent='';return}practice.titleEl.textContent=e.quiz?('题库：'+e.quiz.title):'';practice.stemEl.textContent=q.stem;practice.optsEl.innerHTML='';q.options.forEach((opt,i)=>{const d=document.createElement('div');d.className='opt';const rb=document.createElement('input');rb.type='radio';rb.name='practice_opt';rb.value=i;const lb=document.createElement('label');lb.textContent=opt;d.appendChild(rb);d.appendChild(lb);practice.optsEl.appendChild(d)});practice.feedbackEl.textContent='';practice.evalBox.style.display='none';practice.summaryEl.textContent=statsText(e)}
function getPracticeSelected(){const radios=[...practice.optsEl.querySelectorAll('input[type=radio]')];const r=radios.find(x=>x.checked);return r?[parseInt(r.value,10)]:[]}
function statsText(e){const s=e.stats();return '统计：已做 '+s.answered+' | 正确 '+s.score+' | 错误 '+s.wrong+' / 共 '+s.total}
function saveWrong(entry){const path='yywx_wrong_questions';const existing=store.get(path,[]);const key=(entry.quiz_id||'')+'|'+(entry.question_id||'')+'|'+(entry.selected||[]).join(',');const seen=new Set(existing.map(x=> (x.quiz_id||'')+'|'+(x.question_id||'')+'|'+(x.selected||[]).join(',')));if(!seen.has(key)){existing.push(entry);store.set(path,existing)}}
function appendExamResult(payload){const path='yywx_exam_results';const existing=store.get(path,[]);existing.push(payload);store.set(path,existing)}
function saveProgress(payload){store.set('yywx_progress',payload)}
async function preparePractice(quizFile){const qz=await loadQuiz(quizFile);currentQuiz=qz;engine=qz?createEngine(qz):createEngine({title:'题库缺失',questions:[]});renderPracticeQuestion(engine)}
practice.nextBtn.onclick=()=>{const q=engine.current();if(!q)return;const sel=getPracticeSelected();if(!sel.length){alert('请先选择一个选项');return}const ok=engine.check(sel);if(ok){engine.score+=1;practice.feedbackEl.style.color='green';practice.feedbackEl.textContent='回答正确';practice.evalBox.style.display='none';practice.summaryEl.textContent=statsText(engine);engine.next();renderPracticeQuestion(engine)}else{practice.feedbackEl.style.color='#b00020';practice.feedbackEl.textContent='回答错误。解析：'+(q.explanation||'');const entry={quiz_id:engine.quiz?engine.quiz.id:'',quiz_title:engine.quiz?engine.quiz.title:'',question_id:q.id,stem:q.stem,options:q.options,correct_answer:q.answer,selected:sel,tags:q.tags||[],timestamp:new Date().toISOString().slice(0,19)};saveWrong(entry);practice.evalBox.style.display='flex';practice.summaryEl.textContent=statsText(engine)}}
practice.saveEvalBtn.onclick=()=>{const q=engine.current();if(!q){alert('当前没有需要评价的错题');return}const sel=getPracticeSelected();const rating=parseInt((practice.ratingSel.value||'3').split(' ')[0],10)||3;const entry={quiz_id:engine.quiz?engine.quiz.id:'',quiz_title:engine.quiz?engine.quiz.title:'',question_id:q.id,stem:q.stem,options:q.options,correct_answer:q.answer,selected:sel,tags:q.tags||[],timestamp:new Date().toISOString().slice(0,19),rating,comment:practice.commentEl.value||''};saveWrong(entry);alert('已保存到错题本');practice.evalBox.style.display='none';engine.next();renderPracticeQuestion(engine)}
function buildQuizFromWrong(){const entries=store.get('yywx_wrong_questions',[]);if(!entries.length)return{ id:'quiz_wrong_review', title:'错题本复习（空）', questions:[]};const latest={};entries.forEach(e=>{const qid=e.question_id||'';latest[qid]=e});const qs=Object.values(latest).map(e=>({id:e.question_id||e.stem||'wrong',type:'single_choice',stem:e.stem||'',options:e.options||[],answer:e.correct_answer||[],tags:e.tags||[],explanation:e.explanation||'',difficulty:'L1'}));return{ id:'quiz_wrong_review', title:'错题本复习', questions:qs}}
function renderWrongQuestion(e){const q=e.current();if(!q){wrong.stemEl.textContent='错题本为空或练习已结束';wrong.optsEl.innerHTML='';wrong.feedbackEl.textContent='';wrong.summaryEl.textContent='';return}wrong.titleEl.textContent=e.quiz?('题库：'+e.quiz.title):'';wrong.stemEl.textContent=q.stem;wrong.optsEl.innerHTML='';q.options.forEach((opt,i)=>{const d=document.createElement('div');d.className='opt';const rb=document.createElement('input');rb.type='radio';rb.name='wrong_opt';rb.value=i;const lb=document.createElement('label');lb.textContent=opt;d.appendChild(rb);d.appendChild(lb);wrong.optsEl.appendChild(d)});wrong.feedbackEl.textContent='';wrong.summaryEl.textContent=statsText(e)}
wrong.refreshBtn.onclick=()=>{const quiz=buildQuizFromWrong();wrongEngine=createEngine(quiz);renderWrongQuestion(wrongEngine)}
wrong.nextBtn.onclick=()=>{const q=wrongEngine.current();if(!q)return;const radios=[...wrong.optsEl.querySelectorAll('input[type=radio]')];const r=radios.find(x=>x.checked);if(!r){alert('请先选择一个选项');return}const sel=[parseInt(r.value,10)];const ok=wrongEngine.check(sel);if(ok){wrongEngine.score+=1;wrong.feedbackEl.style.color='green';wrong.feedbackEl.textContent='回答正确';wrong.summaryEl.textContent=statsText(wrongEngine);wrongEngine.next();renderWrongQuestion(wrongEngine)}else{wrong.feedbackEl.style.color='#b00020';wrong.feedbackEl.textContent='回答错误。解析：'+(q.explanation||'');wrong.summaryEl.textContent=statsText(wrongEngine)}}
async function prepareExam(quizFile){const qz=await loadQuiz(quizFile);examQuiz=qz;if(!qz){exam.infoEl.textContent='题库文件未找到';exam.pagesEl.innerHTML='';return}const all=[...qz.questions];for(let i=all.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[all[i],all[j]]=[all[j],all[i]]}examQuestions=all.slice(0,Math.min(100,all.length));examPageSize=10;exam.titleEl.textContent=qz.title;exam.infoEl.textContent='题目：'+examQuestions.length+' | 每页：'+examPageSize+' （随机顺序）';buildExamPages();examPageIndex=0;updateExamPageLabel()}
function buildExamPages(){exam.pagesEl.innerHTML='';const total=examQuestions.length;if(!total){const d=document.createElement('div');d.textContent='当前题库为空或文件未找到';exam.pagesEl.appendChild(d);return}for(let start=0;start<total;start+=examPageSize){const end=Math.min(total,start+examPageSize);const page=document.createElement('div');page.className='exam-page';for(let idx=start;idx<end;idx++){const q=examQuestions[idx];const wrap=document.createElement('div');wrap.className='question';const stem=document.createElement('div');stem.textContent=(idx+1)+'. '+q.stem;wrap.appendChild(stem);const row=document.createElement('div');row.className='opt-inline';q.options.forEach((opt,i)=>{const rb=document.createElement('input');rb.type='radio';rb.name='exam_'+idx;rb.value=i;const lb=document.createElement('label');lb.textContent=opt;row.appendChild(rb);row.appendChild(lb)});wrap.appendChild(row);page.appendChild(wrap)}exam.pagesEl.appendChild(page)}showExamPage(0)}
function showExamPage(i){[...exam.pagesEl.children].forEach((c,idx)=>c.style.display=idx===i?'block':'none')}
function updateExamPageLabel(){const totalPages=Math.max(1,Math.ceil(examQuestions.length/examPageSize));exam.pageEl.textContent='第 '+(examPageIndex+1)+'/'+totalPages+' 页'}
exam.prevBtn.onclick=()=>{if(examPageIndex<=0)return;examPageIndex-=1;showExamPage(examPageIndex);updateExamPageLabel()}
exam.nextBtn.onclick=()=>{const totalPages=Math.max(1,Math.ceil(examQuestions.length/examPageSize));if(examPageIndex>=totalPages-1)return;examPageIndex+=1;showExamPage(examPageIndex);updateExamPageLabel()}
exam.submitBtn.onclick=()=>{if(!examQuestions.length){alert('没有可提交的考试题目');return}const selected=[];examQuestions.forEach((q,idx)=>{const radios=[...document.querySelectorAll('input[name="exam_'+idx+'"]')];const r=radios.find(x=>x.checked);selected.push(r?parseInt(r.value,10):-1)});let score=0;const wrongEntries=[];examQuestions.forEach((q,i)=>{const sel=selected[i];const ok=(sel!==-1)&&JSON.stringify([sel])===JSON.stringify(q.answer);if(ok){score+=1}else{wrongEntries.push({quiz_id:examQuiz?examQuiz.id:'',quiz_title:examQuiz?examQuiz.title:'',question_id:q.id,stem:q.stem,options:q.options,correct_answer:q.answer,selected: sel!==-1?[sel]:[],tags:q.tags||[],timestamp:new Date().toISOString().slice(0,19)})}});wrongEntries.forEach(saveWrong);appendExamResult({quiz_id:examQuiz?examQuiz.id:'',quiz_title:examQuiz?examQuiz.title:'',total:examQuestions.length,score,wrong:examQuestions.length-score,timestamp:new Date().toISOString().slice(0,19)});const total=examQuestions.length;let appraisal='继续努力';if(score===total)appraisal='超级优秀';else if(score>=Math.floor(0.9*total))appraisal='优秀';alert('得分：'+score+'/'+total+'\n评价：'+appraisal)}
document.getElementById('btn-plus').onclick=()=>{setFontSize(baseFont+1);setStatus('当前字号：'+baseFont+'   点击左侧课程，右侧选择功能进行学习、练习、考试')}
document.getElementById('btn-minus').onclick=()=>{setFontSize(baseFont-1);setStatus('当前字号：'+baseFont+'   点击左侧课程，右侧选择功能进行学习、练习、考试')}
tabs.forEach(t=>t.onclick=()=>switchTab(t.dataset.tab))
setFontSize(baseFont)
renderLessonList()
if(LESSONS.length){onLessonSelected(LESSONS[0])}