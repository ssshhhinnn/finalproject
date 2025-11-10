/* global $ */
$(function(){
  // set year in footer
  const y = new Date().getFullYear();
  $('#year, #year2, #year3, #year4, #year5').text(y);

  // THEME toggle (save to localStorage)
  const themeToggle = $('#themeToggle');
  const stored = localStorage.getItem('theme') || 'light';
  applyTheme(stored);
  themeToggle.on('click', () => {
    const cur = $('body').attr('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(cur);
    localStorage.setItem('theme', cur);
  });
  function applyTheme(name){
    if(name==='dark'){
      $('body').css('background','#0f1724').css('color','#f8fafc').attr('data-theme','dark');
    } else {
      $('body').css('background','').css('color','').attr('data-theme','light');
    }
  }

  // CONTACT FORM validation (real-time)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  $('#email').on('input', function(){
    const val = $(this).val();
    if(!emailRegex.test(val)) {
      $(this).addClass('invalid');
      $('#emailError').show();
    } else {
      $(this).removeClass('invalid');
      $('#emailError').hide();
    }
  });

  // Password strength indicator
  $('#password').on('input', function(){
    const v = $(this).val();
    let score = 0;
    if(v.length >= 8) score++;
    if(/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
    if(/[0-9]/.test(v)) score++;
    if(/[^A-Za-z0-9]/.test(v)) score++;
    const label = ['Weak','Medium','Strong','Very strong'][Math.max(0,Math.min(3,score-1))] || 'Weak';
    $('#pwdStrength').text(label);
  });

  // Confirm password live check
  $('#passwordConfirm, #password').on('input', function(){
    if($('#passwordConfirm').val() !== $('#password').val()){
      $('#passwordConfirm').addClass('invalid');
      $('#pwdConfirmError').show();
    } else {
      $('#passwordConfirm').removeClass('invalid');
      $('#pwdConfirmError').hide();
    }
  });

  // Submit handler with prevention if invalid
  $('#contactForm').on('submit', function(e){
    e.preventDefault();
    let ok = true;
    if(!$('#name').val()) { $('#name').addClass('invalid'); ok=false; }
    if(!emailRegex.test($('#email').val())) { $('#email').addClass('invalid'); ok=false; }
    if($('#password').val().length < 6) { $('#password').addClass('invalid'); ok=false; }
    if($('#passwordConfirm').val() !== $('#password').val()) { $('#passwordConfirm').addClass('invalid'); ok=false; }
    if(!$('#message').val()) { $('#message').addClass('invalid'); ok=false; }

    if(!ok){
      alert('Проверьте форму — есть ошибки.');
      return;
    }
    // success (demo): show bootstrap modal or alert
    alert('Сообщение отправлено (демо).');
    this.reset();
    $('#pwdStrength').text('—');
  });

  // GALLERY filter & search
  function filterGallery(filter, query){
    $('.gallery-item').each(function(){
      const cat = $(this).data('category');
      const title = $(this).data('title')?.toString().toLowerCase() || '';
      const matchesCategory = (filter === 'all') || (cat === filter);
      const matchesQuery = !query || title.indexOf(query.toLowerCase()) !== -1;
      if(matchesCategory && matchesQuery){
        $(this).show().addClass('fade-in');
      } else {
        $(this).hide();
      }
    });
  }
  let currentFilter = 'all';
  $('.filter-btn').on('click', function(){
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');
    currentFilter = $(this).data('filter');
    filterGallery(currentFilter, $('#searchGallery').val());
  });
  $('#searchGallery').on('input', function(){
    const q = $(this).val();
    filterGallery(currentFilter, q);
  });

  // Lightbox
  const $lightbox = $('#lightbox');
  let currentIndex = -1;
  const items = $('.gallery-item').toArray();
  function openLightbox(index){
    const $it = $(items[index]);
    $('#lbImg').attr('src', $it.find('img').attr('src'));
    $('#lbCaption').text($it.data('title'));
    $lightbox.show();
    currentIndex = index;
  }
  function closeLightbox(){ $lightbox.hide(); }
  $('.gallery-item').on('click', function(){
    const idx = items.indexOf(this);
    openLightbox(idx);
  });
  $('#lbClose').on('click', closeLightbox);
  $('#lbNext').on('click', function(){
    currentIndex = (currentIndex+1) % items.length;
    openLightbox(currentIndex);
  });
  $('#lbPrev').on('click', function(){
    currentIndex = (currentIndex-1 + items.length) % items.length;
    openLightbox(currentIndex);
  });

  // Modal booking (example): validate modal form
  $('#modalForm').on('submit', function(e){
    e.preventDefault();
    if(!$('#modalName').val() || !emailRegex.test($('#modalEmail').val())){
      alert('Введите имя и корректный email');
      return;
    }
    $('#contactModal').modal('hide');
    alert('Заявка отправлена (демо)');
    this.reset();
  });

  // CRUD table demo (in-memory)
  const data = [
    {id:1, title:'Сессия №1', date:'2025-06-10'},
    {id:2, title:'Свадьба А&B', date:'2025-07-22'}
  ];
  function renderTable(){
    let html = '<table class="table"><thead><tr><th>Title</th><th>Date</th><th>Actions</th></tr></thead><tbody>';
    data.forEach(item=>{
      html += `<tr data-id="${item.id}"><td>${item.title}</td><td>${item.date}</td><td>
        <button class="edit btn btn-sm btn-outline-primary">Edit</button>
        <button class="delete btn btn-sm btn-outline-danger">Delete</button>
      </td></tr>`;
    });
    html += '</tbody></table>';
    $('#crudContainer').html(html);
  }
  // (If you add a CRUD section on a page include a #crudContainer element)
  if($('#crudContainer').length) renderTable();
  // Delegate edit/delete
  $(document).on('click', '.delete', function(){
    const id = $(this).closest('tr').data('id');
    if(confirm('Удалить запись?')){
      const idx = data.findIndex(x=>x.id===id);
      if(idx>-1){
        data.splice(idx,1);
        renderTable();
      }
    }
  });
  $(document).on('click', '.edit', function(){
    const id = $(this).closest('tr').data('id');
    const item = data.find(x=>x.id===id);
    const newTitle = prompt('Новый заголовок', item.title);
    if(newTitle){
      item.title = newTitle;
      renderTable();
    }
  });

}); // end jQuery ready
