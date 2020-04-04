//let requestURL = 'js/json/signin.json';
let requestURL = 'js/json/interview.json';
//let requestURL = 'js/json/addpost.json';
//let requestURL = 'js/json/colorsheme.json';

buildForm(requestURL);

function buildForm(requestURL) {
  fetch(requestURL)
    .then((response) => response.json())
    .then((jsonObj) => {

      let mainContainer = document.querySelector('#main-container');
      let form = document.createElement('form');

      form.setAttribute('role', 'form');
      form.setAttribute('name', 'signin');

      buildTitle(jsonObj, form);
      buildFields(jsonObj, form);
      buildRef(jsonObj,form);
      buildButtons(jsonObj, form);

      mainContainer.append(form);

  });
}

function buildWrapper(fields){

  //let formRow = document.createElement('div');
  let formGroup = document.createElement('div');

  formGroup.className = 'form-group';
  //formRow.className = 'form-row justify-content-center';
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

function buildTitle(jsonObj, form) {

  let h1 = document.createElement('h4');

  h1.className = 'text-center mb-4';
  h1.textContent = jsonObj['name'];

  form.prepend(h1);
}

function buildLabel(fields, i){
  if(fields.hasOwnProperty('label')){
    let label = document.createElement('label');
    label.htmlFor = 'test' + i;
    label.textContent = fields.label;
    if(fields.input.type == 'checkbox'){
      label.className = 'form-check-label';
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

  if(fields.input.type != 'checkbox'){
    input.className = 'form-control form-control-lg';    
  }
  else{
    input.className = 'form-check-input check';
    input.checked = fields.input.checked;
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

      fields.input.technologies.forEach( (techelem,i) =>  wrapper.append(buildTechnology(techelem, i)))
      
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
      btn.className = 'btn btn-primary w-100';

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

    jsonObj.references.forEach(function(references, i){

      let p = document.createElement('p');
      let a = document.createElement('a');

      a.textContent = references.text;
      a.name = references.ref;
      a.href = '#';

      // if(references.input != undefined){
      //   console.log(references.hasOwnProperty('input'));
      //   p.append();
      //   console.log(1);
      //   console.log(typeof references);

      // }
      if(references.hasOwnProperty('text without ref')){

        p.textContent = references['text without ref'] + ' ';
        row.className = 'text-center';

      }

      a.addEventListener('click', {
        handleEvent(){
          form.remove();
          requestURL = 'js/json/' + a.name + '.json';
          buildForm(requestURL);
        }
      });

      p.append(a);
      row.append(p);

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
