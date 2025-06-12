/**
 *
 * @source: http://www.masto.cat/assets/app.js
 *
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2018  Kim
 * Copyright (C) 2023  ZEN
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
*/

//Response example : https://mstdn.social/api/v1/timelines/tag/mastocat

$(function() {

  $.ajaxSetup({
    headers: { 'Accept-Language': '' }
  });

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  });

	var tag       = null;
	var lastid    = null;
	var cats      = [];
	var allow     = ['jpg', 'jpeg', 'gif', 'png'];

	function loadPosts(tag, lastid = null) {
    var data = $.ajax({
      url: "https://mstdn.social/api/v1/timelines/tag/" + tag,
      async: false,
      data: {local: 0, only_media: 1, max_id: lastid, limit: 40}
    }).responseJSON;
    if (data === undefined) {
      alert("Віддалений сервер повернув помилку. Спробуйте повторити спробу пізніше.");
      return lastid;
    }
    let i = 0;
    while (i < data.length) {
      var item = data[i];
      if(item.media_attachments.length) {
        lastid = item.id;
        cats.push(lastid);
        //check is not repeated
        if($.inArray(lastid, cats) !== -1) {
          //check image exists with its file extension
          for (const attachment of item.media_attachments.slice(0, 4)) {
            var filename = attachment.url;
            var ext = filename.substring(filename.lastIndexOf('.')+1, filename.length);
            if(allow.includes(ext)) {
              $('.gal').append('<div class="col-lg-3 col-md-4 col-xs-6"><div class="item d-block mb-4" style="background-color:rgb(117 190 218 / 0.1);background-image:url('+filename+');"><div class="desc text-center"><img src="'+item.account.avatar+'" class="rounded-circle" alt="'+item.account.display_name+'"><div class="name">'+item.account.display_name+'</div><a class="btn btn-primary" target="_blank" href="'+item.url+'">Допис</a>&nbsp;<a class="btn btn-primary" data-lightbox="cats-'+item.id+'" data-title="'+tag+' by '+item.account.username+'" href="'+filename+'">Перегляд</a><div class="counters"><ul><li>Дописів<br>'+item.account.statuses_count+'</li><li>Підписників<br>'+item.account.followers_count+'</li><li>Підписки<br>'+item.account.following_count+'</li></ul></div></div></div>');
            }
          }
        }
      }
      i++;
    }
    return lastid;
	}

  const url = new URL(window.location.href);
  const urlParams = new URLSearchParams(url.search);

  $('#tag').val(urlParams.get('tag'));
  tag = $('#tag').val().length >= 1  ? $('#tag').val() : $('#tag').val("Україна").val();

  urlParams.set('tag', tag);
  url.search = urlParams.toString();
  $(document).prop('title', '#' + tag + ' - Федіверс');
  history.replaceState( {} , "", url );

  jQuery('#loading').show();
	lastid = loadPosts(tag, lastid);
  jQuery('#loading').hide();

  $('#tag').keyup(function(){
    $('#submit').prop('disabled', $('#tag').val().length < 1);
  // }).on("click", function(){
  //   $('#tag').val('');
  //   $('#submit').prop('disabled', $('#tag').val().length < 1);
  }).on('keypress',function(e) {
    if(e.which != 13) { return; }
    if($('#tag').val().length < 1) { return; }
    $('.gal').empty();

    tag = $('#tag').val();

    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);

    urlParams.set('tag', tag);
    url.search = urlParams.toString();

    window.location.assign(url);

    // cats = [];
    // jQuery('#loading').show();
    // lastid = loadPosts(tag, null);
    // jQuery('#loading').hide();
  });

  $('#submit').on('click', function(){
    $('.gal').empty();
    tag = $('#tag').val();

    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);

    urlParams.set('tag', tag);
    url.search = urlParams.toString();

    window.location.assign(url);

    // cats = [];
    // jQuery('#loading').show();
    // lastid = loadPosts(tag, null);
    // jQuery('#loading').hide();
  });

	$(window).scroll(function () {
  	if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
  		// console.log('bottom reached....');
      jQuery('#loading').show();
	 		lastid = loadPosts(tag, lastid);
      jQuery('#loading').hide();
      // console.log(lastid);
    }
  });
});
