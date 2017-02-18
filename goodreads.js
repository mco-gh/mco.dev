key    = '3ehugZDq2NeF6mdiMrydQ'
secret = 'RwldunmzbrcROPjxnl4WkCYijlvZDYbQQa48R6wlLA'

goodreads = require('goodreads');
gr = new goodreads.client({ 'key': key, 'secret': secret });
gr.getSingleShelf({'userID': '24854520', 'shelf': 'recommended'}, function(json) {
    if (json) {
	books = json.GoodreadsResponse.books[0].book;
        for (i = 0; i < books.length; i++) {
	    book = books[i];
	    title = book.title[0];
	    author = book.authors[0].author[0].name[0];
            console.log(`${title} by ${author}`);
        }
    }
});
