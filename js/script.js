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
              <div class="card-header" style="box-shadow: none;">
                <p class="card-header-title">
                  ${book.title}
                </p>
              </div>
              
              <div class="tabs">
                <ul id="detail-tabs">
                  <li class="is-active" data-tab="info-tab"><a>書籍情報</a></li>
                  <li data-tab="summary-tab"><a>あらすじ・感想</a></li
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
                  <p><strong>あらすじ:</strong></p>
                  <p>${book.summary}</p>
                  <br />
                  <p><strong>感想:</strong></p>
                  <p>${book.review}</p>
                </div>
              </div>
            `;

            // タブ切り替え機能
            setupTabSwitching();
          }
        });
      });
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      document.getElementById('book-list').innerHTML = '<p>書籍情報の読み込みに失敗しました。</p>';
    });
} else if (currentPage === 'related-people') {
  // 関連人物ページのスクリプト
  fetch('people.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(people => {
      const peopleList = document.getElementById('people-list');
      // 関連人物一覧を生成
      people.forEach((person, index) => {
        peopleList.innerHTML += `
          <div class="card person-card" data-id="${index}">
            <div class="card-header">
              <p class="card-header-title">
                ${person.name}
              </p>
            </div>
          </div>
        `;
      });

      // 関連人物詳細を表示するためのイベントリスナーを追加
      const personCards = document.querySelectorAll('.person-card');
      const personDetail = document.getElementById('person-detail');  

      personCards.forEach(card => {
        card.addEventListener('click', function() {
          const personId = parseInt(this.dataset.id);
          const person = people[personId];
          if (person) {
            // 内容を更新
            personDetail.innerHTML = `
              <div class="card-header" style="box-shadow: none;">
                <p class="card-header-title">
                  ${person.name}
                </p>
              </div>
              
              <div class="tabs">
                <ul id="detail-tabs">
                  <li class="is-active" data-tab="profile-tab"><a>略歴</a></li>
                  <li data-tab="summary-tab"><a>人物詳細</a></li
                </ul>
              </div>
              
              <div id="tab-content">
                <div id="profile-tab" class="tab-pane is-active">
                  <img src="img/${person.image}" alt="${person.name}" class="person-image">
                  <p><strong>生年:</strong> ${person.birth_year}</p>
                  <p><strong>没年:</strong> ${person.death_year}</p>
                  <p><strong>関係:</strong> ${person.relation}</p>
                </div>
                
                <div id="summary-tab" class="tab-pane" style="display: none;">
                  <p>${person.summary}</p>
                  <br /><br />
                  <p>${person.description}</p>
                </div>
              </div>
            `;
            
            // タブ切り替え機能
            setupTabSwitching();
          }
        });
      });
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      document.getElementById('people-list').innerHTML = '<p>関連人物情報の読み込みに失敗しました。</p>';
    });
}

function setupTabSwitching() {
  const tabs = document.querySelectorAll('#detail-tabs li');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  // すべての画像の読み込みを待ってから高さを計測する
  const images = document.querySelectorAll('.tab-pane img');
  
  // 画像読み込み完了を待つ処理
  const imagePromises = Array.from(images).map(img => {
    if (img.complete) {
      return Promise.resolve(); // すでに読み込み済みの場合
    } else {
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve; // エラーの場合も続行
      });
    }
  });
  
  // すべての画像の読み込みが完了してから高さを計測
  Promise.all(imagePromises).then(() => {
    // いったんすべてのペインを表示して高さを測定
    let maxHeight = 0;
    
    tabPanes.forEach(pane => {
      pane.style.display = 'block';
      pane.style.position = 'absolute'; // 一時的に絶対位置に
      pane.style.visibility = 'hidden'; // 表示はしないが寸法は計測できる
      
      const height = pane.scrollHeight; // scrollHeightで内容全体の高さを取得
      if (height > maxHeight) {
        maxHeight = height;
      }
      
      // 元の状態に戻す
      pane.style.position = '';
      pane.style.visibility = '';
      
      // アクティブでないタブは非表示に
      if (!pane.classList.contains('is-active')) {
        pane.style.display = 'none';
      }
    });
    
    // 高さを固定する
    tabPanes.forEach(pane => {
      pane.style.minHeight = `${maxHeight}px`;
      pane.style.overflow = 'auto';
    });
  });
  
  // タブクリックイベントの設定（変更なし）
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // すべてのタブからアクティブクラスを削除
      tabs.forEach(t => t.classList.remove('is-active'));
      // クリックされたタブにアクティブクラスを追加
      this.classList.add('is-active');
      
      // すべてのタブコンテンツを非表示
      tabPanes.forEach(pane => pane.style.display = 'none');
      
      // 対応するタブコンテンツを表示
      const activeTabId = this.dataset.tab;
      document.getElementById(activeTabId).style.display = 'block';
    });
  });
}