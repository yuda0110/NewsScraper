const createCommentSection = articleId => {
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
                <textarea class="form-control" id="comment" placeholder="Write a comment..." name="comment"></textarea>
            </div>

            <button id="comment-submit" data-id=${articleId} class="btn btn-submit">
                <ion-icon name="pencil-outline"></ion-icon>
                Submit
            </button>
            
            <button id="comment-close" class="btn btn-close">
                <ion-icon name="close-circle"></ion-icon>
                Close
            </button>
        </form>
    `)

    if (data.comments.length > 0) {
      console.log(data.comments)
      const commentList = $('<ul>')
      data.comments.forEach(comment => {
        commentList.append(`
            <li>
                <p>${comment.body}</p>
                <span>${moment(comment.created).format('MMMM Do YYYY')}</span>
            </li>
        `)
      })
      $(commentsSection).append(commentList)
    }

    $(`#article${articleId}`).after(commentsSection)
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
    console.log(data)
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