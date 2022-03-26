let myLeads = [];
let alltabs = [];
const inputEl = document.getElementById('input-el');
const inputBtn = document.getElementById('input-btn');
const ulEl = document.getElementById('ul-el');
const AllulEl = document.getElementById('Allul-el');
const deleteBtn = document.getElementById('delete-btn');
const leadsFromLocalStorage = JSON.parse(localStorage.getItem('myLeads'));
const AllTabsFromLocalStorage = JSON.parse(localStorage.getItem('alltabs'));
const tabBtn = document.getElementById('tab-btn');
const allTabsBtn = document.getElementById('all-tab-btn');
const inputdetail = document.getElementById('input-detail');
const AllTabsDetails = document.getElementById('AllTabs-details');
const openBtn = document.getElementById('open-btn');
const infomessage = document.querySelector('.info-message');
const themeBtn = document.querySelector('.likebtn');
const root = document.documentElement;

// theme change --------------------------------------------------------------
//load previous data ----------------------------------------------------------
root.style.setProperty('--main-Color', localStorage.getItem('themeColor'));
// set new theme color --------------------------------------------------------
themeBtn.addEventListener('change', (e) => {
  root.style.setProperty('--main-Color', e.target.value);
  localStorage.setItem('themeColor', e.target.value);
});
// get root element color from css --------------------------------------------
// let minecolor = getComputedStyle(document.documentElement).getPropertyValue('--main-Color');
// console.log(minecolor);

// Initial render --------------------------------------------------------------
if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}

if (AllTabsFromLocalStorage) {
  alltabs = AllTabsFromLocalStorage;
  renderAlltab(alltabs);
}
// Open All Tabs --------------------------------------------------------------
openBtn.addEventListener('click', () => {
  let urls = alltabs;
  if (alltabs.length !== 0 && alltabs.length < 10) {
    for (let i = 0; i < alltabs.length; i++) {
      // var el = document.querySelector('#hidden');
      // var a = document.createElement('a');
      // a.href = alltabs[i];
      // a.target = '_blank';
      // el.appendChild(a);
      // a.click();
      // ------
      window.open(alltabs[i], '_blank');
      // ------
    }
  }
  if (alltabs.length !== 0 && alltabs.length >= 10) {
    infomessage.innerHTML = `
${alltabs.length}&nbsp; All Tabs &nbsp; &nbsp; &nbsp; &nbsp;
${myLeads.length}&nbsp; Inputs <br/>
 Due to the limitation of the browser, you can only open 10 tabs at a 
time or its going to be a separate window. open in new window?
<button type="button" id="open-yes-btn" >Yes</button>
      <button type="button" id="open-no-btn">No</button>
`;
    return;
    // for (let i = 0; i < alltabs.length; i++) {
    //   let w = window.open(
    //     '',
    //     `_blank`,
    //     'toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=800,height=600'
    //   );
    //   setTimeout(function () {
    //     wo(w);
    //   }, 100);
    //   const wo = (w) => {
    //     w.location = alltabs[i];
    //     w.focus();
    //   };
    // }
  } else if (alltabs.length === 0) {
    alert('No tabs to open');
    return;
  }
});

infomessage.addEventListener('click', (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {
    return;
  }
  const element = event.target.id;
  if (element === 'open-yes-btn') {
    for (let i = 0; i < alltabs.length; i++) {
      let w = window.open(
        '',
        `_blank`,
        'toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=800,height=600'
      );
      setTimeout(function () {
        wo(w);
      }, 100);
      const wo = (w) => {
        w.location = alltabs[i];
        w.focus();
      };
    }
  } else if (element === 'open-no-btn') {
    infomessage.innerHTML = `
    ${alltabs.length}&nbsp; All Tabs &nbsp; &nbsp; &nbsp; &nbsp;
    ${myLeads.length}&nbsp; Inputs
    `;
    return;
  }
});

// save one tap functions --------------------------------------------------
tabBtn.addEventListener('click', function () {
  inputdetail.open = true;
  AllTabsDetails.open = false;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (myLeads.includes(tabs[0].url)) {
      infomessage.innerHTML = `
      This tab is already in your list, Add anyway?
      <button type="button" id="tab-yes-btn" >Yes</button>
      <button type="button" id="tab-no-btn">No</button>
      `;
      return;
    } else {
      myLeads.push(tabs[0].url);
      localStorage.setItem('myLeads', JSON.stringify(myLeads));
      render(myLeads);
    }
  });
});

infomessage.addEventListener('click', (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {
    return;
  }
  const element = event.target.id;
  if (element === 'tab-yes-btn') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      myLeads.push(tabs[0].url);
      localStorage.setItem('myLeads', JSON.stringify(myLeads));
      render(myLeads);
    });
  } else {
    infomessage.innerHTML = `
    ${alltabs.length}&nbsp; All Tabs &nbsp; &nbsp; &nbsp; &nbsp;
    ${myLeads.length}&nbsp; Inputs
    `;
    return;
  }
});

ulEl.addEventListener('click', (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {
    return;
  }
  const element = event.target.id;
  deleteclick(element);
});

function deleteclick(element) {
  for (let i = 0; i < myLeads.length; i++) {
    if (i == element) {
      myLeads.splice(i, 1);
    }
  }
  render(myLeads);
  localStorage.setItem('myLeads', JSON.stringify(myLeads));
}

function render(leads) {
  let listItems = '';
  leads.forEach((element, i) => {
    listItems += `
        <li>
        <div class="subkeys">
        <button id='${i}')" class="smallbutton">X</button> &nbsp;
        <p> ${i + 1}</p>
        <hr class="hrmiddle"/>
        </div>
        <a target='_blank'  href='${element}'>
        ${element}
        </a>
        </li>
        `;
  });
  ulEl.innerHTML = listItems;
}

// All Tabs section-------------------------------------------------------
allTabsBtn.addEventListener('click', function () {
  inputdetail.open = false;
  AllTabsDetails.open = true;
  if (alltabs.length !== 0) {
    infomessage.innerHTML = `
      There Are Some Items On List - YES to add / No to delete & add or cancel.
      <button type="button" id="All-yes-btn" >Yes</button>
      <button type="button" id="All-no-btn">No</button>
      <button type="button" id="All-Cancel-btn">Cancel</button>
      `;
    return;
  } else {
    inputdetail.open = false;
    AllTabsDetails.open = true;
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach((tab) => {
        alltabs.push(tab.url);
      });
      renderAlltab(alltabs);
      localStorage.setItem('alltabs', JSON.stringify(alltabs));
      renderInfo();
    });
  }
});

infomessage.addEventListener('click', (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {
    return;
  }
  const element = event.target.id;
  if (element === 'All-yes-btn') {
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach((tab) => {
        alltabs.push(tab.url);
      });
      renderAlltab(alltabs);
      renderInfo();
      localStorage.setItem('alltabs', JSON.stringify(alltabs));
    });
  } else if (element === 'All-no-btn') {
    alltabs = [];
    renderAlltab(alltabs);
    localStorage.setItem('alltabs', JSON.stringify(alltabs));
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach((tab) => {
        alltabs.push(tab.url);
      });
      renderAlltab(alltabs);
      renderInfo();
      localStorage.setItem('alltabs', JSON.stringify(alltabs));
    });
  } else {
    renderInfo();
    return;
  }
});
// delete all tabs}

AllulEl.addEventListener('click', (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {
    return;
  }
  const element = event.target.id;
  deleteAllclick(element);
});

function deleteAllclick(element) {
  for (let i = 0; i < alltabs.length; i++) {
    if (i == element) {
      alltabs.splice(i, 1);
    }
  }
  renderAlltab(alltabs);
  localStorage.setItem('alltabs', JSON.stringify(alltabs));
}

function renderAlltab(alltabs) {
  let listItems = '';
  alltabs.forEach((element, i) => {
    listItems += `
        <li>
        <div class="subkeys">
        <button id='${i}' class="smallbutton">X</button>&nbsp;
        <p>${i + 1}</p> 
        <hr class="hrmiddle"/>
        </div>
       
       <a target='_blank' href='${element}'>
        ${element}
        </a>
        </li>
        `;
  });

  AllulEl.innerHTML = listItems;
}
// Other Main Functions-------------------------------------------------------

deleteBtn.addEventListener('click', function () {
  infomessage.innerHTML = `
  Are you sure you want to delete all items?
  <button type="button" id="yes-btn" >Yes</button>
  <button type="button" id="no-btn">No</button>
  `;
});
infomessage.addEventListener('click', (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {
    return;
  }
  const element = event.target.id;
  if (element === 'yes-btn') {
    localStorage.clear();
    myLeads = [];
    alltabs = [];
    render(myLeads);
    renderAlltab(alltabs);
    infomessage.innerHTML = `
    ${alltabs.length}&nbsp; All Tabs &nbsp; &nbsp; &nbsp; &nbsp;
    ${myLeads.length}&nbsp; Inputs
    `;
  } else {
    renderInfo();
    return;
  }
});

inputBtn.addEventListener('click', function () {
  if (inputEl.value !== '') {
    inputdetail.open = true;
    AllTabsDetails.open = false;
    myLeads.push(inputEl.value);
    infomessage.textContent = `${inputEl.value} Added`;
    inputEl.value = '';
    localStorage.setItem('myLeads', JSON.stringify(myLeads));
    render(myLeads);
  } else {
    infomessage.textContent = 'Please enter a valid URL';
  }
});

const renderInfo = () => {
  infomessage.innerHTML = `
${alltabs.length}&nbsp; All Tabs &nbsp; &nbsp; &nbsp; &nbsp;
${myLeads.length}&nbsp; Inputs
`;
};
infomessage.innerHTML = `
${alltabs.length}&nbsp; All Tabs &nbsp; &nbsp; &nbsp; &nbsp;
${myLeads.length}&nbsp; Inputs

`;
