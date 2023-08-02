document.addEventListener('DOMContentLoaded', function() {
    showHeader();
    })

const task={
    taskText: '',
    importance: '',
    activity:'',
}
const tasks=[];

function createTask(newTask){
    task.taskText=newTask;
    task.importance='unimportant';
    task.activity='active';
    tasks.push(task);
    addTaskToLS(task);
    addNewSection(task);
}

function addTaskToLS(object){
    const key='tasks';
    var currentTasks=getTaskFromLS();
     object.id=Date.now().toString();
    if(!currentTasks){
        localStorage.setItem(key,JSON.stringify([object]));
    }else{
        localStorage.setItem(key,JSON.stringify(currentTasks.concat(object)));
    }
}

function getTaskFromLS(){
    var jsonString = localStorage.getItem('tasks');
    var object = JSON.parse(jsonString);
    return object;
}

function deleteTaskFromLS(id){
    const key='tasks';
    var tasks=getTaskFromLS();
    var newArr= tasks.filter(task=> task.id!==id);
    var newArrString=JSON.stringify(newArr);
    localStorage.setItem(key,newArrString);
}

function showHeader(){
    addSearchLine();
    addNavs();
    addForm();
    showAllTasks();
}

function addSearchLine() {
    var inputSearch=document.getElementById('search-field');
    inputSearch.addEventListener('keydown', function(event) {
        var searchValue=inputSearch.value.toLowerCase();
        if (event.key === 'Enter') {
            console.log('enter');
            searchTask(searchValue);
            return inputSearch.value='';
        }
    })
}

function searchTask(searchLine) {
    var tasks = getTaskFromLS();
    if(!!searchLine){
        removeSections();
        var newArr = tasks.filter(task => task.taskText.toLowerCase().includes(searchLine));
        newArr.forEach(needTask => {
            addNewSection(needTask);
        })
    }else{
        alert('Enter your search');
    }
}

function addNavs(){
    var linkAllDiv=document.getElementById('allTasksLink');
    var linkActiveDiv=document.getElementById('activeTasksLink');
    var linkDoneDiv=document.getElementById('doneTasksLink');
    linkAllDiv.addEventListener('click',function (event) {
        linkAllDiv.classList.add('link-active');
        linkActiveDiv.classList.remove('link-active');
        linkDoneDiv.classList.remove('link-active');
        showAllTasks();
    })

    linkActiveDiv.addEventListener('click',function (event) {
        linkActiveDiv.classList.add('link-active');
        linkAllDiv.classList.remove('link-active');
        linkDoneDiv.classList.remove('link-active');
        showActiveTasks();
    })

    linkDoneDiv.addEventListener('click',function (event) {
        linkDoneDiv.classList.add('link-active');
        linkActiveDiv.classList.remove('link-active');
        linkAllDiv.classList.remove('link-active');
        showDoneTasks();
    })
}

function showAllTasks(){
    var link=document.getElementById('allTasksLink')
    link.classList.add('link-active');
    const tasks = getTaskFromLS();
    removeSections();
        tasks.forEach(task=> {
            addNewSection(task);
    })
}

function showActiveTasks() {
    var tasks=getTaskFromLS();
    removeSections();
    var newArr= tasks.filter(task=> task.activity!=='done');
    newArr.forEach(task=> {
        addNewSection(task);
    })
}

function showDoneTasks(){
    var tasks=getTaskFromLS();
    removeSections();
    var newArr= tasks.filter(task=> task.activity!=='active');
    newArr.forEach(task=> {
        addNewSection(task);
    })
}

function addForm(){
      var buttonAdd=document.getElementById('addTaskButton');
        buttonAdd.addEventListener('click', function(event){
            addTaskFromForm();
        });
}

function addTaskFromForm(){
        var newTask=document.getElementById('textField');
        if(!newTask.value){
            alert('Try again. Your task is empty.')
        }else{
            createTask(newTask.value);
        }
        newTask.value='';
}

function addNewSection(task) {
    var newSection = document.createElement('section');
    newSection.className = 'task';
    var paragraph = document.createElement('h3');
    paragraph.innerText = task.taskText;
    paragraph.className = 'taskText';
    paragraph.id=task.id;
    paragraph.addEventListener('click',function (event) {
        markTaskAsDone(event);
    })
    if(task.activity==='active'){
        paragraph.classList.add('undoneTask');
    }
    if(task.activity==='done'){
        paragraph.classList.add('doneTask');
    }
    newSection.prepend(paragraph);
    var invisibleButtons = document.createElement('div');
    invisibleButtons.className = 'invisibleButtons';
    var markImportantButton = document.createElement('button');
    markImportantButton.className = 'markImportantButton';
    markImportantButton.addEventListener('click',function (event){
        markTask(event);
    })
    var importantParagraph = document.createElement('p');
    if(task.importance==='important'){
        markImportantButton.classList.add('importantTask');
        paragraph.classList.add('importantText');
    }if(task.importance==='unimportant') {
        markImportantButton.classList.add('unimportantTask');

    }
    importantParagraph.innerText ='MARK IMPORTANT';
    markImportantButton.prepend(importantParagraph);
    invisibleButtons.prepend(markImportantButton);


    var deleteButton = document.createElement('button');
    deleteButton.className = 'deleteButton';

    deleteButton.addEventListener('click',function (event){
      deleteTask(event);
    })

    var deletePic = document.createElement('img');
    deletePic.src = "../resourсes/Delete.svg";
    deleteButton.append(deletePic);
    invisibleButtons.append(deleteButton);
    newSection.append(invisibleButtons);
    var main = document.getElementById('main');
    main.prepend(newSection);
}

function removeSections() {
    var main=document.getElementById('main');
    var sections = main.querySelectorAll('section');
    sections.forEach(function(section) {
        section.remove();
    });
}

function deleteTask(event){
    var buttonPic = event.target;
    var buttonClass = buttonPic.parentNode;
    var invisibleButton = buttonClass.parentNode;
    var section = invisibleButton.parentNode;
    var paragraph = section.querySelector('h3');
    var ind = paragraph.id;
    deleteTaskFromLS(ind);
    section.parentNode.removeChild(section);
    alert('Task was removed');
    location.reload();
}

function markTask(event){
    var buttonText = event.target;
    var buttonClass = buttonText.parentNode;
    console.log(buttonClass);
    var invisibleButton = buttonClass.parentNode;
    var section = invisibleButton.parentNode;
    var paragraph = section.querySelector('h3');
    const key='tasks';
    var tasks=getTaskFromLS();
    var needTask=tasks.find(task=>{
        return task.id===paragraph.id;
    })
    if(needTask.importance==='important'){
        needTask.importance='unimportant';
        buttonClass.classList.remove('importantTask');
        buttonClass.classList.add('unimportantTask');
        paragraph.classList.remove('importantText');
    }else {
        needTask.importance = 'important';
        buttonClass.classList.remove('unimportantTask');
        buttonClass.classList.add('importantTask');
        paragraph.classList.add('importantText');
    }
    console.log(needTask);
    localStorage.setItem(key,JSON.stringify(tasks));
}

function markTaskAsDone(event){
    var paragraph = event.target;
    const key='tasks';
    var tasks=getTaskFromLS();
    var needTask=tasks.find(task=>{
        return task.id===paragraph.id;
    })
    if(needTask.activity==='active'){
        needTask.activity='done';
        paragraph.classList.add('doneTask');
        paragraph.classList.remove('undoneTask');

    }else{
        needTask.activity='active';
        paragraph.classList.remove('doneTask');
        paragraph.classList.add('undoneTask');
    }
    console.log(needTask);
    localStorage.setItem(key,JSON.stringify(tasks));
}









