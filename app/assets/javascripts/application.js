// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require rails-ujs
//= require activestorage
//= require turbolinks
//= require_tree .




$(document).on("turbolinks:load",function()
{
  // Function for table load
  function load_articles(current_page = 1) {
    var success_fun = function (data) {
      if (data.last_page == true) {
        notify("Already on last page can't go any further");
        $("#prev_button").click();
      } else {
        $("#content-space").html("");
        $('html, body').animate({
          'scrollTop': $("#content-space").position().top
        });
        render_articles(data.articles);
       }
    }

    page_url = "/api/v1/articles?page_number=" + current_page;

    make_request('GET', page_url, {}, success_fun)
  }

  load_articles();

  function render_articles(articles) {
    articles.forEach(function (article, index) {
      $("#content-space").append(`
      <br>
      <div class="card mb-3" style="max-width: 540px;">
        <div class="row no-gutters">
          <div class="col-md-4 pt-3">
            <img src="data:image/jpg;base64,${article.article_image}" alt="Avatar" width="100%">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <br>
              <figure>
                <blockquote>
                <p>${article.description}</p>
                </blockquote>
                <figcaption>—${article.title}</figcaption>
              </figure>
              <br>
              <br>
              <div class="btn-group" role="group" aria-label="Basic example" style="min-width: 100px;">
                <button type="button" class="btn btn-primary btn-sm edit-article" data-id=${article.id}>Edit</button>
                <button type="button" class="btn btn-secondary btn-sm delete-article" data-id=${article.id}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br>
      `);
    });
  }



  $(".search-input").keyup(function (e) {
    e.preventDefault();
    article_id = this.dataset.id;
    search = $(".search-input").val()
    url = `/api/v1/articles/search?search=${search}`;

    var success_fun = function (data) {
      $("#content-space").html("");
      render_articles(data);
      $("#content-space").find(".highlight").removeClass("highlight");
      var custfilter = new RegExp(search, "ig");
      var repstr = "<span class='highlight'>" + search + "</span>";

      if (search != "") {
        $('#content-space').children().each(function () {
          $(this).children().slice(1, 3).each(function () {
            $(this).html($(this).html().replace(custfilter, repstr));
          })
        })
      }
    }
    make_request('GET', url, {}, success_fun);
  });


  // For submitting the common form
  $("#common-data-form").on("submit", function (event) {
    event.preventDefault();

    var formValues = new FormData(this);
    var method_type = $(".common_form").attr("method_type");
    var url = $(".common_form").attr("url");
    $("#editing_space").empty();

    if (!(url && method_type)) {
      method_type = 'POST';
      url = "/api/v1/articles";
    } else {
      $(".common_form").removeAttr("method_type");
      $(".common_form").removeAttr("url");
    }


    $("#form-header").html("Add Article");
    $(this).trigger("reset");
    $("#preview-space").attr("src", "/assets/user.png");

    success_fun = function (data) {
      load_articles();
      console.log(data);
      notify('Article saved successfuly');
    }

    make_request(method_type, url, formValues, success_fun);
  });

  // Commmon function for making ajax request
  function make_request(method_type, url, data, success_fun) {
    $.ajax({
      type: method_type,
      url: url,
      data: data,
      dataType: "JSON",
      processData: false,
      contentType: false,
      success: success_fun
    });
  }

  function notify(message) {
    $('#notification-area').showToast({
      duration: 3000,
      mode: 'success',
      message: `<div class="modal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Notification</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <p>${message}</p>
                    </div>
                  </div>
                </div>
              </div>`
    });
    $('#notification-area').trigger('focus');
  }

  $('#preview-space').click(function () {
    $("#exampleFormControlImage").click();
  })

  $("#exampleFormControlImage").change(function (e) {
    readURL(this);
  }
  );

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('#preview-space').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
  }

  $("#prev_button").click(function (e) {
    e.preventDefault();
    $('html, body').animate({
      'scrollTop': $("#content-space").position().top
    });
    current_page = $("#current-page").val();

    if (current_page <= $(this).data("page")) {
      notify("already on First page");
    } else {
      $("#next_button").data('page', current_page);
      current_page = (current_page - 1);
      $("#current-page").val(current_page);

      if (current_page == 1) {
        $(this).data("page", current_page);
      } else {
        $(this).data("page", (current_page - 1));
      }
      load_articles(current_page);
    }
  });

  $("#next_button").click(function (e) {
    e.preventDefault();
    current_page = $(this).data("page");
    $("#current-page").val(current_page);
    $(this).data("page", (current_page + 1));
    $("#prev_button").data('page', (current_page - 1));
    load_articles(current_page);
  });

  $(document).on('click', "#add-article", function (e) {
    e.preventDefault();
    console.log("Nidhi rigged the thing");
    $('html, body').animate({
      'scrollTop': $("#form-header").offset().top
    });
  });


  // Edit User pre-processing
  $(document).on("click", ".edit-article", function (e) {
    e.preventDefault();
    article_id = this.dataset.id;
    url = `/api/v1/articles/${article_id}`

    success_fun = function (data) {
      url = `/api/v1/articles/${data.id}`
      $("#editing_space").append(`<input type="hidden" id="#hidden_id_field" name="article[id]" value="${data.id}">`);
      $("#exampleFormControlInput1").val(data.title);
      $("#exampleFormControlTextarea1").val(data.description);
      $("#preview-space").attr("src", ("data:image/jpg;base64," + data.article_image));

      $('html, body').animate({
        'scrollTop': $("#editing_space").position().top
      });

      $(".common_form").attr("method_type", "PUT");
      $(".common_form").attr("url", url);
      $("#form-header").html("Edit Article");
    }
    make_request('GET', url, {}, success_fun)
  });

  // Function for deleting articles
  $(document).on("click", ".delete-article", function (e) {
    e.preventDefault();
    article_id = this.dataset.id;
    url = `/api/v1/articles/${article_id}`;

    success_fun = function () {
      console.log("data DELETED");
      load_articles();
    }

    make_request('DELETE', url, {}, success_fun);
  });


})

