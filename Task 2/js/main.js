let requestURL = 'js/json/signin.json';


buildForm(requestURL);

function buildForm(requestURL) {
  fetch(requestURL)
    .then((response) => response.json())
    .then((jsonObj) => {

      let mainContainer = document.querySelector('#main-container');
      let form = document.createElement('form');

      form.setAttribute('role', 'form');
      form.setAttribute('name', jsonObj.name);

      buildFields(jsonObj, form);
      buildRef(jsonObj,form);
      buildButtons(jsonObj, form);
      buildLink(form);
      mainContainer.append(form);
      
      buildMask(jsonObj);

    });
}

function buildLink(form){
  let link0 = document.querySelector('#link0');
  let link1 = document.querySelector('#link1');
  let link2 = document.querySelector('#link2');
  let link3 = document.querySelector('#link3');
  let link4 = document.querySelector('#link4');
  link0.onclick = function(){
    requestURL = 'js/json/signin.json'; 
    form.remove();
    buildForm(requestURL);
  }
  link1.onclick = function(){
    requestURL = 'js/json/signup.json'; 
    form.remove();
    buildForm(requestURL);
  }
  link2.onclick = function(){
    requestURL = 'js/json/colorsheme.json'; 
    form.remove();
    buildForm(requestURL);
  }
  link3.onclick = function(){
    requestURL = 'js/json/addpost.json'; 
    form.remove();
    buildForm(requestURL);
  }
  link4.onclick = function(){
    requestURL = 'js/json/interview.json';
    form.remove();
    buildForm(requestURL);
  }  
}

function buildWrapper(fields){

  //let formRow = document.createElement('div');
  let formGroup = document.createElement('div');

  formGroup.className = 'form-group';
  //formRow.className = 'form-row justify-content-center';
  if(fields.input.type == 'file'){
    formGroup.className = 'custom-file my-2';
  }
  if(fields.input.type == 'technology'){
    formGroup.className = 'btn-group-toggle';
    formGroup.setAttribute('data-toggle','buttons')
  }
  if(fields.input.type == 'checkbox'){
    formGroup.className = 'form-check';
  }
  //formRow.append(formGroup)
  return formGroup;

}

function buildLabel(fields, i){
  if(fields.hasOwnProperty('label')){
    let label = document.createElement('label');
    label.htmlFor = 'test' + i;
    label.textContent = fields.label;
    if(fields.input.type == 'checkbox'){
      label.className = 'form-check-label';
    }
    if(fields.input.type == 'file'){
      label.className = 'custom-file-label';
    }
    if(fields.input.type == 'technology'){
      let col = document.createElement('div');
      col.className = 'col pl-0';
      col.append(label);
      return col;
    }
    return label;
  }
  else{
    return '';
  }
}

function buildInput(fields, i){
  let input = document.createElement('input');

  input.type = fields.input.type;
  input.id = 'test' + i;
  if(fields.input.type == 'file'){
    input.className = 'custom-file-input';
  }
  if(fields.input.type != 'checkbox'){
    input.className = 'form-control form-control-lg';    
  }
  else{
    input.className = 'form-check-input check';
    if(fields.input.checked == 'false'){
      input.checked = false;
    }
    else {
      input.checked = true;
    }
    console.log(fields.input.checked);
    input.id = 'check' + i;
    input.addEventListener("click", backToDefaultColor);
  }

  if(fields.input.hasOwnProperty('required')){
    input.required = fields.input.required;

  }
  if(fields.input.placeholder != undefined){
    input.placeholder = fields.input.placeholder;
  }
  if(fields.input.type == 'color'){
    buildDatalist(fields, i, input);
    input.addEventListener("input", changeColor);
  }

  if(fields.input.type == 'textarea'){

    input.remove();
    
    let textarea = document.createElement('textarea');
    
    textarea.required = fields.input.required;
    textarea.className = input.className;
    textarea.id = 'test' + i;
    
    return textarea;
  }

  buildInputFile(fields, input);
  return input;
}

function buildFields(jsonObj, form){

  jsonObj.fields.forEach(function(fields, i){
    let wrapper = buildWrapper(fields);
    if(fields.input.type == 'technology'){

      wrapper.append(buildLabel(fields, i));

      fields.input.technologies.forEach( (techelem,i) =>  wrapper.append(buildTechnology(techelem, i)));

    }
    else if(fields.input.type == 'checkbox'){
      wrapper.append(buildInput(fields, i), buildLabel(fields, i));
    }
    else{
      wrapper.append(buildLabel(fields, i), buildInput(fields, i));
    }
    
    form.append(wrapper);
  });
}

function buildButtons(jsonObj, form){
  if(jsonObj.buttons != undefined){

    let row = document.createElement('div');
    row.className = 'row justify-content-center mt-4';

    jsonObj.buttons.forEach(function(buttons,i){

      let col = document.createElement('div');
      let btn = document.createElement('input');

      col.className = 'col-6 col-sm-6 col-md-6';
      btn.className = 'btn btn-primary w-100 mb-5';

      btn.type = 'submit';
      btn.value = buttons.text;

      col.append(btn);
      row.append(col);

    });

    form.append(row)

  }
}

function buildRef(jsonObj, form){
  
  if(jsonObj.references != undefined){
    let row = document.createElement('div');
    row.className = 'row justify-content-between';

    jsonObj.references.forEach(function(references, i){

      let p = document.createElement('p');
      let a = document.createElement('a');

      a.textContent = references.text;
      a.name = references.ref;
      a.href = '#';


      if(references.hasOwnProperty('text without ref')) 
        p.textContent = references['text without ref'] + ' ';
      
      if(form.name == 'register') 
        row.className = ' text-center';

      a.addEventListener('click', {
        handleEvent(){
          form.remove();
          requestURL = 'js/json/' + a.name + '.json';
          buildForm(requestURL);
        }
      });


      if(references.input != undefined){
        p.remove();
        let wrapper = buildWrapper(references);
        wrapper.append(buildInput(references, i));
        row.className = 'pl-4';
        form.append(wrapper);
      }
      else if(form.name == 'login'){
        let col = document.createElement('div');
        col.className = 'col-12 col-sm-5'; 
        p.className = 'ref' + i;
        p.append(a);
        col.append(p);
        row.append(col);
      }
      else{
        p.append(a);
        row.append(p);
      }
    });
    form.append(row);

  }
}

function buildDatalist(fields, i, colorfield){

  let datalist = document.createElement('datalist');

  colorfield.setAttribute('list','colorlist' + i);
  colorfield.removeAttribute('placeholder');
  datalist.id = 'colorlist' + i;

  for(let key of fields.input.colors){
    let option = document.createElement('option');
    option.value = key;
    datalist.append(option);
  }

  colorfield.append(datalist);
  return colorfield;

}

function changeColor(event){

  let body = document.querySelector('body');
  let checkbox = document.querySelector('.check');
  body.style.color = event.target.value;
  checkbox.checked = false;

}

function backToDefaultColor(){

  let checkbox = document.querySelector('.check');
  let body = document.querySelector('body');
  //let computedStyle = getComputedStyle(document.body);
  if(checkbox.checked){
    body.style.color = 'rgb(33, 37, 41)';    
    //body.style.color = computedStyle.color;
  }

}

function buildInputFile(fields, input){

  if(fields.input.type == 'file' && fields.input.filetype != undefined){

    input.setAttribute('multiple', fields.input.multiple)
    input.className = 'form-control-file';

    let arr = '';

    fields.input.filetype.forEach(elem =>{

      arr += '.' + elem + ', ';
      input.setAttribute('accept', arr);

    });
  }
  else if(fields.input.type == 'file'){
    input.className = 'form-control-file';
  }
  return input;
}

function buildTechnology(techelem, i){

  let technologies = document.createElement('input');
  let label = document.createElement('label');

  technologies.type = 'checkbox';
  technologies.id = 'option' + i;
  technologies.setAttribute('autocomplete', 'off');

  label.htmlFor = 'option' + i;
  label.textContent = techelem;
  label.className = 'btn btn-primary btn-tags';

  label.append(technologies);
  return label;
}

function buildMask(jsonObj){

  jsonObj.fields.forEach(function(fields, i){
    if(fields.input.mask != undefined){
      let input = document.querySelector('#test' + i);
      input.type = 'text';
      $('#test'+ i).mask(fields.input.mask);
    }
  })
}
