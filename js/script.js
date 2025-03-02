document.getElementById('btnAbout').addEventListener('click', function() {
    document.getElementById('message-dialog').classList.add('is-active');
});
document.getElementById('message-close-button').addEventListener('click',function(){
    document.getElementById('message-dialog').classList.remove('is-active');
});

fetch('/menu.html')
  .then(response => response.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = doc.querySelectorAll('a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (href === './' && currentPage === 'index.html')) {
        const listItem = link.parentElement;
        listItem.textContent = link.textContent;
        listItem.classList.add('is-active');
        listItem.style.fontWeight = 'bold';
        listItem.style.backgroundColor = 'lightblue';
      }
    });

    document.getElementById('menu-placeholder').innerHTML = doc.body.innerHTML;
  });

fetch('/footer.html')
.then(response => response.text())
.then(html => {
  document.getElementById('footer-placeholder').innerHTML = html;
});

function toggleCard(button) {
  // 全てのカードコンテンツを取得
  const allCardContents = document.querySelectorAll('.card-content');
  const allIcons = document.querySelectorAll('.card-header-icon i');
  
  // クリックされたカードのコンテンツとアイコンを取得
  const clickedCardContent = button.closest('.card').querySelector('.card-content');
  const clickedIcon = button.querySelector('i');
  // クリックされたカードの状態を退避
  var cardStatus = clickedCardContent.style.display;
  
  // まず全てのカードを閉じる
  allCardContents.forEach(content => {
    content.style.display = 'none';
  });
  allIcons.forEach(icon => {
    icon.classList.remove('fa-angle-up');
    icon.classList.add('fa-angle-down');
  });
  
  if (cardStatus === 'none') {
    // クリックされたカードが閉じていた場合は開く
    clickedCardContent.style.display = 'block';
    clickedIcon.classList.remove('fa-angle-down');
    clickedIcon.classList.add('fa-angle-up');
  } else {
    // クリックされたカードが開いていた場合は閉じる
    clickedCardContent.style.display = 'none';
    clickedIcon.classList.remove('fa-angle-up');
    clickedIcon.classList.add('fa-angle-down');
  }
}