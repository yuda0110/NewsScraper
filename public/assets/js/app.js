$(document).on('click', '.comment-btn', function() {
  if ($('#comments')) {
    $('#comments').remove()
  }
  // Save the data-id from the button
  const articleId = $(this).attr('data-id')

  // Now make an ajax call for the Article
  $.ajax({
    method: 'GET',
    url: `/articles/${articleId}`
  }).done(data => {
    console.log(data)
    const commentsSection = $('<div id="comments">')
    $(commentsSection).append(`
        <form id="comment-form" action="">
            <div class="form-group">
                <label for="comment" class="label">Comment for ${articleId}</label>
                <textarea class="form-control" id="comment" placeholder="Write a comment..." name="comment">
                </textarea>
            </div>

            <button id="form-submit" type="submit" class="btn btn-submit">
                <ion-icon name="pencil-outline"></ion-icon>
                Submit
            </button>
        </form>
    `)

    if (data.comments.length > 0) {
      const commentList = $('<ul>')
      data.comments.forEach(comment => {
        commentList.append(`
            <li>
                <p>${comment.body}</p>
                <span>${comment.created}</span>
            </li>
        `)
      })
      $(commentsSection).append(commentList)
    }

    $(`#article${articleId}`).after(commentsSection)
  }).fail(err => {
    console.log(err)
  })
})