const createCommentSection = articleId => {
  // Now make an ajax call for the Article
  $.ajax({
    method: 'GET',
    url: `/articles/${articleId}`
  }).done(data => {
    const commentsSection = $('<div id="comments">')
    $(commentsSection).append(`
        <form id="comment-form" action="">
            <div class="form-group">
                <label for="comment" class="label">Comment</label>
                <textarea class="form-control" id="comment" placeholder="Write a comment..." name="comment"></textarea>
            </div>

            <button id="comment-submit" data-id=${articleId} class="btn btn-submit">
                <ion-icon name="pencil-outline"></ion-icon>
                Submit
            </button>
        </form>
    `)

    $(commentsSection).append(`
        <ion-icon id="comment-close" name="close-circle" class="close-icon"></ion-icon>
    `)

    if (data.comments.length > 0) {
      const commentHeading = $('<h2>').append('<ion-icon name="chatbubbles-sharp"></ion-icon>Comments')
      const commentList = $('<ul class="comment-list">')
      data.comments.reverse().forEach(comment => {
        commentList.append(`
            <li>
                <span class="date">${moment(comment.created).format('MM-DD-YYYY')}</span>
                <p>${comment.body}</p>
            </li>
        `)
      })
      const commentView = $('<div class="comment-view">').append(commentHeading, commentList)
      $(commentsSection).append(commentView)
    }

    $(`#article${articleId}`).append(commentsSection)
  }).fail(err => {
    console.log(err)
  })
}


$(document).on('click', '.btn-comment', function(e) {
  e.preventDefault()

  if ($('#comments')) {
    $('#comments').remove()
  }
  // Save the data-id from the button
  const articleId = $(this).attr('data-id')

  createCommentSection(articleId)
})


$(document).on('click', '#comment-submit', function(e) {
  e.preventDefault()
  // Grab the id associated with the article from the submit button
  const articleId = $(this).attr('data-id')
  const commentEl = $('#comment')

  // Run a POST request to change the comment, using what's entered in the inputs
  $.ajax({
    method: 'POST',
    url: `/articles/${articleId}`,
    data: {
      body: commentEl.val()
    }
  }).done(data => {
    $('#comments').remove()
    createCommentSection(articleId)
  }).fail(err => {
    console.log(err)
  })
})


$(document).on('click', '#comment-close', (e) => {
  if ($('#comments')) {
    $('#comments').remove()
  }
  e.preventDefault()
})