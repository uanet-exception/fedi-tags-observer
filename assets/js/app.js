/**
 *
 * @source: http://www.masto.cat/assets/app.js
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2018  Kim
 *
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

//Response example : https://mastodon.social/api/v1/timelines/tag/mastocat

$(function() {

	const baseurl = "https://mastodon.social/api/v1/";
	const tag 	  = "mastocat";
	var lastid    = null;
	var cats      = [];	
	var allow     = ['jpg', 'jpeg', 'gif', 'png'];
	var trigger   = $('.item');

	function loadCats() {			
		//get lastid from browser storage and remove
		lastid = localStorage.getItem('mastocatId');
		console.log(lastid);
		//Download posts from the selected tag
		$.getJSON(baseurl+"/timelines/tag/"+tag, {local: 0, only_media: 1, max_id: lastid, limit: 40}, function(result) {
			jQuery('#loading').show();
			$.each(result, function(i, data) {							   
			    if(data.media_attachments.length) {
			    	lastid = data.id;
			    	cats.push(lastid);
			    	//check is not repeated			    	
			    	if($.inArray(lastid, cats) !== -1) {
			    		//check image exists with its file extension
			    		var filename = data.media_attachments[0].url;
			    		var ext = filename.substring(filename.lastIndexOf('.')+1, filename.length);
			    		if(allow.includes(ext)) {		    		
			    			$('.gal').append('<div class="col-lg-3 col-md-4 col-xs-6"><div class="item d-block mb-4" style="background-image:url('+filename+');"><div class="desc text-center"><img src="'+data.account.avatar+'" class="rounded-circle" alt="'+data.account.display_name+'"><div class="name">'+data.account.display_name+'</div><a class="btn btn-primary" target="_blank" href="web+mastodon://follow?uri=acct:'+data.account.acct+'">Follow</a>&nbsp;<a class="btn btn-primary" data-lightbox="cats-'+data.id+'" data-title="#Mastocat by '+data.account.username+'" href="'+filename+'">Open</a><div class="counters"><ul><li>Toots<br>'+data.account.statuses_count+'</li><li>Followers<br>'+data.account.followers_count+'</li><li>Following<br>'+data.account.following_count+'</li></ul></div></div></div>');
			    		}
			    	}
			    }
			});
			//console.log(lastid);
			localStorage.setItem('mastocatId', lastid);
			jQuery('#loading').hide();	
		});
	}
	
	localStorage.removeItem('mastocatId');
	loadCats();
		
	$(window).scroll(function () {
   		if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
   			console.log('bottom reached....');
	  		loadCats();
   		}
	});

});

