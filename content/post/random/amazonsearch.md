+++
categories = ["Random"]
tags = ["search"]
title = "A Killer Feature for Amazon.com"
date = "2010-01-12"
thumbnailImage = "/img/amazonsearch.png"
+++
Dear Amazon.com,

There’s one feature I really wish you would add.
<!--more-->
When searching for a product, if I select a department (like books or electronics), you give me the ability to sort the search results in various ways, like relevance and price. I really like sorting on the average customer rating (1-5 stars), because it gives me a sense of which products are best reviewed.

Here’s the problem: the value of a high average rating is proportional to the number of people who’ve rated the product. One thousand 5 star ratings are a lot more significant than one top rating. If my search happens to be somewhat broad (e.g. “bluetooth headsets”) I can easily generate several hundred hits and the highest rated hits are going to be a bunch of questionable products that happen to enjoy perfect 5 star ratings because exactly one person really, really liked them. But due to the nature of statistics, the bell curve, etc., any product with a lot of reviews will have a less than perfect average rating and will be found several pages down the list. Which means I have to tediously click and scan my way to the good stuff.

So, please consider this simple enhancement, for each product in your catalog:

Take the average number of stars and subtract 2.5 (to normalize the rating around zero).
Multiply the result of the last step by the number of people who rated the product.
Store the resulting number in your database and make it visible (and sortable) to customers. Call it the “customer quality factor” (CQF) or some snazzy marketing term.
With the feature above, if one person rates a book 5 stars, it’ll have a CQF of 2.5. But if 1,000 people give a book 4.5 stars, it’ll have a CQF of 2,000! Negative numbers indicate a below average rating and a large negative CQF means a lot of people gave it a rating below 2.5 stars.

This enhancement would make the highly AND widely reviewed items stand out. It would make it easy for your customers to find your best reviewed products without spending their time scanning page after page of search hits. Using this data, Amazon.com could automatically generate “best rated” lists of products in various categories. I wonder which ten books and CDs in your catalog currently enjoy the highest CQF. Hmmm…

Please, Amazon.com, implement this one feature and make an old friend really happy.

Yours truly,

Marc Cohen
