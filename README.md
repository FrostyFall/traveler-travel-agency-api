### RESTful API for [Traveler Project](https://github.com/FrostyFall/traveler-travel-agency)

#### Endpoints:<br>
 - ```GET``` **/locations**<br>
Example: get all locations from the database;<br>
URI: /locations<br><br>

 - ```GET``` **/agency-reviews**<br>
Example: get all agency's reviews from the database;<br>
URI: /agency-reviews<br><br>

 - ```GET``` **/popular-tours-previews**<br>
Example: get all popular tours' previews;<br>
URI: /popular-tours-previews<br><br>

 - ```GET``` **/all-tours-previews?skip=6&minPrice=0&maxPrice=999&scores=12345&country='The%20United%20States'**<br>
Example: display all tours from 'The United States' location with minimum price of $99;<br>
URI: /all-tours-previews?minPrice=99&country='The%20United%20States';<br><br>

 - ```GET``` **/all-tours/:tourId**<br>
Example: get tour with ID of 1 from the database;<br>
URI: /all-tours/1<br><br>

 - ```POST``` **/bookTour**<br>
Example: save the record of booking some tour to the database<br>
URI: /bookTour<br>
Body: { fullName, phone, email, plan }<br>
