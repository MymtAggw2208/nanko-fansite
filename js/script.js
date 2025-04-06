// 全ページ共通のスクリプト
document.getElementById('btnAbout').addEventListener('click', function() {
    document.getElementById('message-dialog').classList.add('is-active');
});
document.getElementById('message-close-button').addEventListener('click',function(){
    document.getElementById('message-dialog').classList.remove('is-active');
});

// メニューとフッターを読み込む
fetch('menu.html')
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

fetch('footer.html')
.then(response => response.text())
.then(html => {
  document.getElementById('footer-placeholder').innerHTML = html;
});

// カードの開閉
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

// ページ固有のスクリプト（ページのIDによって判定）
const currentPage = document.body.id; // body要素のid属性を取得
if (currentPage === 'in-fiction') {
  // 創作における楠木正成ページのスクリプト
  fetch('books.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(books => {
      const bookList = document.getElementById('book-list');
      // 書籍タイトル一覧を生成
      books.forEach((book, index) => {
        bookList.innerHTML += `
          <div class="card book-card" data-id="${index}">
            <div class="card-header">
              <p class="card-header-title">
                ${book.title}
              </p>
            </div>
          </div>
        `;
      });

      // 書籍詳細を表示するためのイベントリスナーを追加
      const bookCards = document.querySelectorAll('.book-card');
      const bookDetails = document.getElementById('book-details');

      bookCards.forEach(card => {
        card.addEventListener('click', function() {
          const bookId = parseInt(this.dataset.id);
          const book = books[bookId];
          if (book) {
            // タブ式の表示に変更
            bookDetails.innerHTML = `
              <div class="card-header">
                <p class="card-header-title">
                  ${book.title}
                </p>
              </div>
              
              <div class="tabs">
                <ul id="detail-tabs">
                  <li class="is-active" data-tab="info-tab"><a>書籍情報</a></li>
                  <li data-tab="summary-tab"><a>あらすじ</a></li>
                  <li data-tab="review-tab"><a>感想</a></li>
                </ul>
              </div>
              
              <div id="tab-content">
                <div id="info-tab" class="tab-pane is-active">
                  <img src="img/${book.image}" alt="${book.title}" class="book-image">
                  <p><strong>著者:</strong> ${book.author}</p>
                  <p><strong>出版社:</strong> ${book.publisher}</p>
                  <p><strong>発行年月日:</strong> ${book.published_date}</p>
                  <p><strong>ISBN:</strong> ${book.isbn}</p>
                  <p><strong>備考:</strong> ${book.note}</p>
                  <div class="buttons mt-5">
                    <a href="${book.purchase_link}" class="button is-danger is-fullwidth">
                      <span class="icon">
                        <i class="fas fa-shopping-bag"></i>
                      </span>
                      <span>${book.purchase_shop}</span>
                    </a>
                  </div>
                </div>
                
                <div id="summary-tab" class="tab-pane" style="display: none;">
                  <p>${book.summary}</p>
                </div>
                
                <div id="review-tab" class="tab-pane" style="display: none;">
                  <p>${book.review}</p>
                </div>
              </div>
            `;
            
            // タブ切り替え機能の追加
            const tabs = document.querySelectorAll('#detail-tabs li');
            tabs.forEach(tab => {
              tab.addEventListener('click', function() {
                // すべてのタブからアクティブクラスを削除
                tabs.forEach(t => t.classList.remove('is-active'));
                // クリックされたタブにアクティブクラスを追加
                this.classList.add('is-active');
                
                // すべてのタブコンテンツを非表示
                const tabPanes = document.querySelectorAll('.tab-pane');
                tabPanes.forEach(pane => pane.style.display = 'none');
                
                // 対応するタブコンテンツを表示
                const activeTabId = this.dataset.tab;
                document.getElementById(activeTabId).style.display = 'block';
              });
            });
          }
        });
      });
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      document.getElementById('book-list').innerHTML = '<p>書籍情報の読み込みに失敗しました。</p>';
    });
}