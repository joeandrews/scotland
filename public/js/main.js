window.app = angular.module('mean', ['ngCookies', 'ngResource', 'ui.router', 'ui.bootstrap', 'ui.keypress', 'restangular', 'ezfb', 'angular-momentjs', 'mean.system', 'mean.admin', 'mean.directives', 'mean.public']);

angular.module('mean.system', []);
angular.module('mean.admin', []);
angular.module('mean.directives', []);
angular.module('mean.public', []);angular.module('mean.system').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('admin/calendars/createOrModify.html',
    "<div ng-controller=\"CreateOrModifyCalendarCtrl\">\n" +
    "\t<div id=\"leftColumn\" class=\"col-sm-5\">\n" +
    "\t\t<div class=\"well well-small\" id=\"mealCalendar\" ng-model=\"selectedDate\" ng-change=\"dateChanged(selectedDate)\" style=\"display:inline-block;\">\n" +
    "\t\t\t<datepicker min=\"minDate\" show-weeks=\"showWeeks\"></datepicker>\n" +
    "\t\t</div>\n" +
    "\t\t<form class='form-horizontal'>\n" +
    "\t\t\t<div id=\"newMeal\">\n" +
    "\t\t\t\t<label class='radio-inline'><input type=\"radio\" ng-model=\"newMealType\" value=\"dinner\">Dinner</label>\n" +
    "\t\t\t\t<label class='radio-inline'><input type=\"radio\" ng-model=\"newMealType\" value=\"lunch\">Lunch</label>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<button type=\"button\" ng-controller=\"ListModal\"  ng-click=\"open('meals', tableData, calendar.meals[dateString][newMealType], mealCallback)\" class=\"btn btn-primary\">Add/Change Meals</button>\n" +
    "\t\t</form>\n" +
    "\t</div>\n" +
    "\t<div id=\"mealList\" class=\"col-sm-7\">\n" +
    "\t\t<div ng-repeat=\"(mealTime, availableMeals) in displayedMeals track by $index\">\n" +
    "\t\t\t<div class=\"header\">{{mealTime}}</div>\n" +
    "\t\t\t<div class=\"meal\" ng-if=\"availableMeals.length == 0\">\n" +
    "\t\t\t\tNo meals for {{mealTime}} today.\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"meal\" ng-repeat=\"existingMeal in availableMeals track by $index\">\n" +
    "\t\t\t\t<img class=\"thumbnail\" ng-src={{existingMeal.images[0]}} />\n" +
    "\t\t\t\t<div class=\"mealInfo\">\n" +
    "\t\t\t\t\t<div class=\"mealName\">{{existingMeal.name}}</div>\n" +
    "\t\t\t\t\t<div class=\"mealDescription\">{{existingMeal.description}}</div>\n" +
    "\t\t\t\t\t<div class=\"tags\">\n" +
    "\t\t\t\t\t\t<img ng-repeat=\"tag in tags\" ng-src={{tag.image}} />\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"controls\">\n" +
    "\n" +
    "\t\t\t\t\t<button type=\"button\" ng-click=\"removeMeal(existingMeal, mealTime)\" class=\"btn btn-danger\">x</button>\n" +
    "\t\t\t\t\t<button type=\"button\" ng-click=\"changePriority(existingMeal._id, mealTime, -1)\" class=\"btn btn-default\"><i class=\"fa fa-angle-up\"></i></button>\n" +
    "\t\t\t\t\t<button type=\"button\" ng-click=\"changePriority(existingMeal._id, mealTime, 1)\"  class=\"btn btn-default\"><i class=\"fa fa-angle-down\"></i></button>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<div class=\"controls\">\n" +
    "\t\t\t\t<button type=\"submit\" ng-click=\"submit()\" class=\"btn btn-primary\">Save</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('admin/calendars/list.html',
    "<div ng-controller=\"ListCalendarsCtrl\" class=\"listTable\">\n" +
    "\t<div class=\"modifiers\">\n" +
    "\t\t<div class=\"col-cs-4 pull-right\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"search\" placeholder=\"Search\"/>\n" +
    "\t\t</div>\n" +
    "\t\t<button type=\"button\" class=\"pull-left btn btn-primary\" ng-click=\"view()\" >+</button>\n" +
    "\t</div>\n" +
    "\t<div class=\"table-responsive\">\n" +
    "\t\t<table class=\"table table-bordered table-hover\">\n" +
    "\t\t\t<tr>\n" +
    "\t\t\t\t<th ng-click=\"predicate='name'; reverse=!reverse;\">Name</th>\n" +
    "\t\t\t</tr>\n" +
    "\t\t\t<tr ng-repeat=\"calendar in calendars | filter:search | orderBy:predicate:reverse\">\n" +
    "\t\t\t\t<td ng-click=\"view(calendar)\">{{calendar.name}}</td>\n" +
    "\t\t\t</tr>\n" +
    "\t\t</table>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('admin/common/table.html',
    "<div class=\"modal-body\">\n" +
    "\t<div class=\"listTable modalTable\">\n" +
    "\t\t<div class=\"modifiers\">\n" +
    "\t\t\t<div class=\"col-cs-4 pull-right\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"search\" placeholder=\"Search\"/>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"table-responsive\">\n" +
    "\t\t\t<table class=\"table table-bordered table-hover\">\n" +
    "\t\t\t\t<tr>\n" +
    "\t\t\t\t\t<th ng-repeat=\"column in columns\" ng-click=\"predicate=column; reverse=!reverse;\" ng-hide=\"column.hide\">{{column.label}}</th>\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t\t<tr ng-repeat=\"row in rows | filter:search | orderBy:predicate:reverse\" ng-click=\"select(row)\" ng-class=\"rowClass(row)\">\n" +
    "\t\t\t\t\t<td ng-repeat=\"column in columns\" ng-hide=\"column.hide\">{{row[column.field]}}</td>\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t</table>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "\t<button class=\"btn btn-primary\" ng-click=\"ok()\">Close</button>\n" +
    "</div>"
  );


  $templateCache.put('admin/coupons/createOrModify.html',
    "<div id=\"coupon-code-form\" ng-controller=\"CreateOrModifyCouponCtrl\">\n" +
    "\t<form class=\"form-horizontal createOrModifyForm\" role=\"form\" ng-submit=\"submit()\">\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputCode\" class=\"col-sm-3 control-label\">Code</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputCode\" ng-model=\"coupon.code\" placeholder=\"Code\" value={{coupon.code}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputDescription\" class=\"col-sm-3 control-label\">Description</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputDescription\" ng-model=\"coupon.description\" placeholder=\"Description\" value={{coupon.description}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label class=\"col-sm-3 control-label\">Stripe Coupons</label>\n" +
    "\t\t\t<div class=\"controls\">\n" +
    "\t\t\t\t<div class=\"dropdown col-sm-3 form-control-static\">\n" +
    "\t\t\t\t\t<a class=\"dropdown-toggle\">{{coupon.stripe_id || \"Select a Stripe Coupon\"}} <span class=\"caret\"></span></a>\n" +
    "\t\t\t\t\t<ul class=\"dropdown-menu\">\n" +
    "\t\t\t\t\t<li ng-repeat=\"coupon in stripeCoupons\">\n" +
    "\t\t\t\t\t\t<a ng-click=\"setStripeId(coupon)\">{{coupon.id}}</a>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t</ul>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputNumberAvailable\" class=\"col-sm-3 control-label\">Number Available</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputNumberAvailable\" ng-model=\"coupon.number_available\" placeholder=\"Number Available\" value={{coupon.number_available}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputCredits\" class=\"col-sm-3 control-label\">Credits</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputCredits\" ng-model=\"coupon.credits\" placeholder=\"Meal Credits\" value={{coupon.credits}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<div class=\"col-sm-offset-3 col-sm-5 controls\">\n" +
    "\t\t\t\t<button type=\"submit\" class=\"btn btn-primary\">Save</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "</div>"
  );


  $templateCache.put('admin/coupons/list.html',
    "<div ng-controller=\"ListCouponsCtrl\" class=\"listTable\">\n" +
    "\t<div class=\"modifiers\">\n" +
    "\t\t<div class=\"col-cs-4 pull-right\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"search\" placeholder=\"Search\"/>\n" +
    "\t\t</div>\n" +
    "\t\t<button type=\"button\" class=\"pull-left btn btn-primary\" ng-click=\"view()\" >+</button>\n" +
    "\t</div>\n" +
    "\t<div class=\"table-responsive\">\n" +
    "\t\t<table class=\"table table-bordered table-hover\">\n" +
    "\t\t\t<tr>\n" +
    "\t\t\t\t<th ng-click=\"predicate='code'; reverse=!reverse;\">Code</th>\n" +
    "\t\t\t\t<th ng-click=\"predicate='description'; reverse=!reverse;\">Description</th>\n" +
    "\t\t\t\t<th ng-click=\"predicate='stripe_id'; reverse=!reverse;\">Stripe Id</th>\n" +
    "\t\t\t\t<th ng-click=\"predicate='number_available'; reverse=!reverse;\">Number Available</th>\n" +
    "\n" +
    "\t\t\t</tr>\n" +
    "\t\t\t<tr ng-repeat=\"coupon in coupons | filter:search | orderBy:predicate:reverse\">\n" +
    "\t\t\t\t<td ng-click=\"view(coupon)\">{{coupon.code}}</td>\n" +
    "\t\t\t\t<td ng-click=\"view(coupon)\">{{coupon.description}}</td>\n" +
    "\t\t\t\t<td ng-click=\"view(coupon)\">{{coupon.stripe_id}}</td>\n" +
    "\t\t\t\t<td ng-click=\"view(coupon)\">{{coupon.number_available}}</td>\n" +
    "\t\t\t</tr>\n" +
    "\t\t</table>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('admin/home.html',
    "<section data-ng-controller=\"AdminIndexCtrl\">\n" +
    "\t<div id=\"page-wrapper\">\n" +
    "\t\t<div id=\"sidebar-wrapper\">\n" +
    "\t\t\t<ul class=\"list-group\">\n" +
    "\t\t\t\t<li class=\"list-group-item\"><strong>Key Objects</strong></li>\n" +
    "\t\t\t\t<li class=\"list-group-item\"><a ui-sref=\".users.list\">Users</a></li>\n" +
    "\t\t\t\t<li class=\"list-group-item\"><a ui-sref=\".meals.list\">Meals</a></li>\n" +
    "\t\t\t\t<li class=\"list-group-item\"><a ui-sref=\".calendars.list\">Meal Calendars</a></li>\n" +
    "\t\t\t\t<li class=\"list-group-item\"><a ui-sref=\".kitchens.list\">Kitchens</a></li>\n" +
    "\t\t\t\t<li class=\"list-group-item\"><a ui-sref=\".orders.search\">Orders</a></li>\n" +
    "\t\t\t\t<li class=\"list-group-item\"><strong>Secondary Objects</strong></li>\n" +
    "\t\t\t\t<li class=\"list-group-item\"><a ui-sref=\".coupons.list\">Coupons</a></li>\n" +
    "\t\t\t\t<li class=\"list-group-item\"><a ui-sref=\".tags.list\">Meal Tags</a></li>\n" +
    "\t\t\t\t<!-- <li class=\"list-group-item\"><a ui-sref=\".ingredients.list\">Ingredients</a></li>\n" +
    "\t\t\t\t<li class=\"list-group-item\"><a ui-sref=\".supplies.list\">Supplies</a></li>\n" +
    "\t\t\t\t<li class=\"list-group-item\"><a ui-sref=\".reviews.list\">Reviews</a></li> -->\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\t\t<div id=\"content-wrapper\" ui-view>\n" +
    "\t\t<button type=\"button\" ng-click=\"fb()\">login with fb</button>\n" +
    "\t\t<!-- Home View should contain useful stats  -->\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</section>"
  );


  $templateCache.put('admin/ingredients/createOrModify.html',
    "<div id=\"ingredient-form\" ng-controller=\"CreateOrModifyIngredientCtrl\">\n" +
    "\t<form class=\"form-horizontal createOrModifyForm\" role=\"form\" ng-submit=\"submit()\">\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputIngredient\" class=\"col-sm-2 control-label\">Ingredient</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputIngredient\" ng-model=\"ingredient.name\" placeholder=\"Ingredient\" value={{ingredient.name}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<div class=\"col-sm-offset-2 col-sm-5 controls\">\n" +
    "\t\t\t\t<div class=\"checkbox\">\n" +
    "\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t<input type=\"checkbox\" ng-model=\"ingredient.nut\"> Nut\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\t\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<div class=\"col-sm-offset-2 col-sm-5 controls\">\n" +
    "\t\t\t\t<div class=\"checkbox\">\n" +
    "\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t<input type=\"checkbox\" ng-model=\"ingredient.gluten\"> Gluten\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\t\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputIngredientMeasure\" class=\"col-sm-2 control-label\">Measure</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputIngredientMeasure\" ng-model=\"ingredient.measure\" placeholder=\"Measure\" value={{ingredient.measure}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputIngredientOrderQuantity\" class=\"col-sm-2 control-label\">Order Quantity</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputIngredientOrderQuantity\" ng-model=\"ingredient.order_quantity\" placeholder=\"Measure\" value={{ingredient.order_quantity}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<div class=\"col-sm-offset-2 col-sm-5 controls\">\n" +
    "\t\t\t\t<button type=\"submit\" class=\"btn btn-default\">Save</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "</div>"
  );


  $templateCache.put('admin/ingredients/list.html',
    "<div ng-controller=\"ListIngredientsCtrl\">\n" +
    "    <div class=\"modifiers\">\n" +
    "        <input type=\"text\" class=\"pull-right\" ng-model=\"search\" placeholder=\"Search\"/>\n" +
    "        <button type=\"button\" class=\"pull-left btn btn-primary\" ng-click=\"view()\" >+</button>\n" +
    "    </div>\n" +
    "    <table class=\"table table-bordered table-hover\">\n" +
    "        <tr>\n" +
    "            <th ng-click=\"predicate='name'; reverse=!reverse;\">Ingredient</th>\n" +
    "            <th ng-click=\"predicate='measure'; reverse=!reverse;\">Measure</th>\n" +
    "            <th ng-click=\"predicate='gluten'; reverse=!reverse;\">Gluten</th>\n" +
    "            <th ng-click=\"predicate='nut'; reverse=!reverse;\">Nut</th>\n" +
    "            <th ng-click=\"predicate='order_quanity'; reverse=!reverse;\">Order Quantity</th>\n" +
    "            <th ng-click=\"predicate='suppliers'; reverse=!reverse;\">Suppliers</th>\n" +
    "\n" +
    "        </tr>\n" +
    "        <tr ng-repeat=\"ingredient in ingredients | filter:search | orderBy:predicate:reverse\">\n" +
    "            <td ng-click=\"view(ingredient)\">{{ingredient.name}}</td>\n" +
    "            <td ng-click=\"view(ingredient)\">{{ingredient.measure}}</td>\n" +
    "            <td ng-click=\"view(ingredient)\">{{ingredient.gluten}}</td>\n" +
    "            <td ng-click=\"view(ingredient)\">{{ingredient.nut}}</td>\n" +
    "            <td ng-click=\"view(ingredient)\">{{ingredient.order_quantity}}</td>\n" +
    "            <td ng-click=\"view(ingredient)\">{{ingredient.suppliers.length}}</td>\n" +
    "\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "</div>"
  );


  $templateCache.put('admin/kitchens/createOrModify.html',
    "<div id=\"kitchen-form\" ng-controller=\"CreateOrModifyKitchenCtrl\">\n" +
    "\t<form class=\"form-horizontal createOrModifyForm\" role=\"form\" ng-submit=\"submit()\">\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputName\" class=\"col-sm-2 control-label\">Name</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputName\" ng-model=\"kitchen.name\" placeholder=\"Name\" value={{kitchen.name}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputAddress\" class=\"col-sm-2 control-label\">Address</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputAddress\" ng-model=\"kitchen.address\" placeholder=\"Address\" value={{kitchen.address}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputAddress2\" class=\"col-sm-2 control-label\">Address 2</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputAddress2\" ng-model=\"kitchen.address2\" placeholder=\"Address 2\">\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputCity\" class=\"col-sm-2 control-label\">City</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputCity\" ng-model=\"kitchen.city\" placeholder=\"City\">\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputZip\" class=\"col-sm-2 control-label\">Zip</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputZip\" ng-model=\"kitchen.zip\" placeholder=\"Zip\" value={{kitchen.zip}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputPhone\" class=\"col-sm-2 control-label\">Phone Number</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputPhone\" ng-model=\"kitchen.phone\" placeholder=\"Phone Number\" value={{kitchen.phone}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputMealPlanCutOff\" class=\"col-sm-2 control-label\">Mealplan Cutoff</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"MealPlanCutOff\" ng-model=\"kitchen.mealplanCutoff\" placeholder=\"MealPlan CutOff (HH:MM:SS)\" value={{kitchen.mealplanCutoff}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"changeOverTime\" class=\"col-sm-2 control-label\">Change Over Time</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"changeOverTime\" ng-model=\"kitchen.changeOverTime\" placeholder=\"Change Over Time (HH:MM:SS)\" value={{kitchen.changeOverTime}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"promoText\" class=\"col-sm-2 control-label\">Promo Text</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"promoText\" ng-model=\"kitchen.promoText\" placeholder=\"Promo Text\" value={{kitchen.promoText}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputZipsServed\" class=\"col-sm-2 control-label\">Zips Served</label>\n" +
    "\t\t\t<div class=\"zipsServed controls form-control-static col-sm-3\">\n" +
    "\t\t\t\t<span ng-repeat=\"zip in kitchen.zips_served\" class=\"\">{{zip}}, </span>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<div class=\"controls col-sm-offset-2\">\n" +
    "\t\t\t\t\t<div class=\"col-sm-2\">\n" +
    "\t\t\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputZipsServed\" ng-model=\"newZip\" placeholder=\"Add Zip\">\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"col-sm-1\">\n" +
    "\t\t\t\t\t\t<button type=\"button\" ng-click=\"addZip(newZip)\" class=\"btn btn-info\">Add</button>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputCalendar\" class=\"col-sm-2 control-label\">Calendar</label>\n" +
    "\t\t\t<div class=\"controls col-sm-4\">\n" +
    "\t\t\t\t<button class=\"btn btn-info\" type=\"button\" ng-controller=\"ListModal\"  ng-click=\"open('calendars', tableData, kitchen.calendar, calendarCallback)\">{{kitchen.calendar ? 'Change' : 'Select' }}</button>\n" +
    "\t\t\t\t<span class=\"form-control-static\">\n" +
    "\t\t\t\t\t{{kitchen.calendar ? kitchen.calendar + \" Selected\" : \"No Calendar Selected\"}}\n" +
    "\t\t\t\t</span>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<br>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<h5 class ='col-sm-offset-1'>Delivery Times   Quantity Cutoff    Delivery Cutoff</h5>\n" +
    "\t\t\t<div class='col-sm-offset-1 kitchenDeliveryTimesRow container row'  ng-repeat=\"(time,cutoffs) in kitchen.deliveryTimes\">\n" +
    "\t\t\t\t<div class='deliveryTimeKitchen'>\n" +
    "\t\t\t\t\t<h4>{{time}}</h4>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class='deliveryTimeInput'>\n" +
    "\t\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"quantityCutoff\" ng-model=\"cutoffs.quantityCutoff\" placeholder=\"Quantity\" value={{cutoffs.quantityCutoff}}>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class='deliveryTimeInput'>\n" +
    "\t\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"deliveryCutoff\" ng-model=\"cutoffs.deliveryCutoff\" placeholder=\"Delivery Cutoff\" value={{cutoffs.deliveryCutoff}}>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"cronJobs\" class=\"col-sm-2 control-label\">Cron Jobs</label>\n" +
    "\t\t\t<div class='cron-job' jobs='kitchen.cronJobs' owner='kitchen._id'></div>\n" +
    "\t\t</div>\t\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<div class=\"col-sm-offset-2 col-sm-5 controls\">\n" +
    "\t\t\t\t<button type=\"submit\" class=\"btn btn-primary\">Save</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "</div>"
  );


  $templateCache.put('admin/kitchens/list.html',
    "<div ng-controller=\"ListKitchensCtrl\" class=\"listTable\">\n" +
    "\t<div class=\"modifiers\">\n" +
    "\t\t<div class=\"col-cs-4 pull-right\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"search\" placeholder=\"Search\"/>\n" +
    "\t\t</div>\n" +
    "\t\t<button type=\"button\" class=\"pull-left btn btn-primary\" ng-click=\"view()\" >+</button>\n" +
    "\t</div>\n" +
    "\t<div class=\"table-responsive\">\n" +
    "\t\t<table class=\"table table-bordered table-hover\">\n" +
    "\t\t\t<tr>\n" +
    "\t\t\t\t<th ng-click=\"predicate='name'; reverse=!reverse;\">Name</th>\n" +
    "\t\t\t\t<th ng-click=\"predicate='address'; reverse=!reverse;\">Address</th>\n" +
    "\t\t\t\t<th ng-click=\"predicate='phone'; reverse=!reverse;\">Phone</th>\n" +
    "\t\t\t\t<th ng-click=\"predicate='orderCount'; reverse=!reverse;\"># Orders Tonight</th>\n" +
    "\n" +
    "\t\t\t</tr>\n" +
    "\t\t\t<tr ng-repeat=\"kitchen in kitchens | filter:search | orderBy:predicate:reverse\">\n" +
    "\t\t\t\t<td ng-click=\"view(kitchen)\">{{kitchen.name}}</td>\n" +
    "\t\t\t\t<td ng-click=\"view(kitchen)\">{{kitchen.address}}<span ng-hide=\"!kitchen.address2\">{{', ' + kitchen.address2}}</span>, {{kitchen.zip}}, {{kitchen.city}}</td>\n" +
    "\t\t\t\t<td ng-click=\"view(kitchen)\">{{kitchen.phone}}</td>\n" +
    "\t\t\t\t<td ng-click=\"view(kitchen)\">{{kitchen.orders.length}}</td>\n" +
    "\t\t\t</tr>\n" +
    "\t\t</table>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('admin/meals/createOrModify.html',
    "<div id=\"meal-form\" ng-controller=\"CreateOrModifyMealCtrl\">\n" +
    "\t<form class=\"form-horizontal createOrModifyForm\" role=\"form\" ng-submit=\"submit()\">\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputName\" class=\"col-sm-2 control-label\">Name</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputName\" ng-model=\"meal.name\" placeholder=\"Code\" value={{meal.name}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputDescription\" class=\"col-sm-2 control-label\">Description</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputDescription\" ng-model=\"meal.description\" placeholder=\"Description\" value={{meal.description}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputSalt\" class=\"col-sm-2 control-label\">Salt</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputSalt\" ng-model=\"meal.salt\" placeholder=\"Salt Content\" value={{meal.salt}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputFat\" class=\"col-sm-2 control-label\">Fat</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputFat\" ng-model=\"meal.fat\" placeholder=\"Fat Content\" value={{meal.fat}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputProtein\" class=\"col-sm-2 control-label\">Protein</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputProtein\" ng-model=\"meal.protien\" placeholder=\"Protein\" value={{meal.protein}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputCalories\" class=\"col-sm-2 control-label\">Calories</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputCalories\" ng-model=\"meal.calories\" placeholder=\"Calories\" value={{meal.calories}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputOtherNutritonal\" class=\"col-sm-2 control-label\">Other Nutritional Info</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputOtherNutritonal\" ng-model=\"meal.other_nutritional\" placeholder=\"Other Nutritional\" value={{meal.other_nutritional}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label class=\"col-sm-2 control-label\">Type</label>\n" +
    "\t\t\t<div class=\"controls\">\n" +
    "\t\t\t\t<div class=\"dropdown col-sm-3 form-control-static\">\n" +
    "\t\t\t\t\t<a class=\"dropdown-toggle\">{{meal.type || \"Select a Type\"}} <span class=\"caret\"></span></a>\n" +
    "\t\t\t\t\t<ul class=\"dropdown-menu \">\n" +
    "\t\t\t\t\t\t<li ng-repeat=\"type in types\">\n" +
    "\t\t\t\t\t\t\t<a ng-click=\"setType(type)\">{{type}}</a>\n" +
    "\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t</ul>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputSelectTags\" class=\"col-sm-2 control-label\">Tags </label>\n" +
    "\t\t\t<div class=\"controls col-sm-3\">\n" +
    "\t\t\t\t<button class=\"btn btn-info\" type=\"button\" ng-controller=\"ListModal\" ng-click=\"open('tags', tableData, meal.tags, tagCallback)\">Change Tags</button>\n" +
    "\t\t\t\t<span class=\"form-control-static\">\n" +
    "\t\t\t\t\t{{meal.tags ? meal.tags.length + \" Tags Selected\" : \"0 Tags Selected\"}}\n" +
    "\t\t\t\t</span>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<div class=\"col-sm-offset-2 col-sm-5 controls\">\n" +
    "\t\t\t\t<upload></upload>\n" +
    "\t\t\t\t<img class=\"thumbnail\" ng-model=\"meal.images[0]\" ng-src={{meal.images[0]}} />\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<div class=\"col-sm-offset-2 col-sm-5 controls\">\n" +
    "\t\t\t\t<button type=\"submit\" class=\"btn btn-primary\">Save</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "</div>"
  );


  $templateCache.put('admin/meals/list.html',
    "<div ng-controller=\"ListMealsCtrl\" class=\"listTable\">\n" +
    "\t<div class=\"modifiers\">\n" +
    "\t\t<div class=\"col-cs-4 pull-right\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"search\" placeholder=\"Search\"/>\n" +
    "\t\t</div>\n" +
    "\t\t<button type=\"button\" class=\"pull-left btn btn-primary\" ng-click=\"view()\" >+</button>\n" +
    "\t</div>\n" +
    "\t<div class=\"table-responsive\">\n" +
    "\t\t<table class=\"table table-bordered table-hover\">\n" +
    "\t\t\t<tr>\n" +
    "\t\t\t\t<th ng-click=\"predicate='meal_name'; reverse=!reverse;\">Name</th>\n" +
    "\t\t\t\t<th ng-click=\"predicate='description'; reverse=!reverse;\">Description</th>\n" +
    "\t\t\t\t<th ng-click=\"reverse=!reverse;\">Image</th>\n" +
    "\t\t\t\t<th ng-click=\"predicate='tags'; reverse=!reverse;\">Tags</th>\n" +
    "\t\t\t</tr>\n" +
    "\t\t\t<tr ng-repeat=\"meal in meals | filter:search | orderBy:predicate:reverse\">\n" +
    "\t\t\t\t<td ng-click=\"view(meal)\">{{meal.name}}</td>\n" +
    "\t\t\t\t<td ng-click=\"view(meal)\">{{meal.description}}</td>\n" +
    "\t\t\t\t<td ng-click=\"view(meal)\"><img ng-src={{meal.images[0]}} /></td>\n" +
    "\t\t\t\t<td ng-click=\"view(meal)\"><span ng-repeat=\"tag in meal.tags\">{{tag.name}}{{meal.tags.length > 1 ? ',' : ''}}</span></td>\n" +
    "\t\t\t</tr>\n" +
    "\t\t</table>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('admin/orders/createOrModify.html',
    "<div id=\"order-form\" ng-controller=\"CreateOrModifyOrderCtrl\">\n" +
    "\t<form class=\"form-horizontal createOrModifyForm\" role=\"form\" ng-submit=\"submit()\">\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputUser\" class=\"col-sm-2 control-label\">Date</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<div class=\"well well-small\" id=\"inputDate\" ng-model=\"order.date\" ng-change=\"dateSelected(selectedDate)\" style=\"display:inline-block;\">\n" +
    "\t\t\t\t\t<datepicker min=\"minDate\" show-weeks=\"showWeeks\"></datepicker>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputDate\" class=\"col-sm-2 control-label\">Date</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<div class=\"well well-small\" id=\"inputDate\" ng-model=\"order.date\" ng-change=\"dateSelected(selectedDate)\" style=\"display:inline-block;\">\n" +
    "\t\t\t\t\t<datepicker min=\"minDate\" show-weeks=\"showWeeks\"></datepicker>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<div class=\"col-sm-offset-2 col-sm-5 controls\">\n" +
    "\t\t\t\t<button type=\"submit\" class=\"btn btn-default\">Save</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "</div>\n"
  );


  $templateCache.put('admin/orders/kitchenSearch.html',
    "<div id=\"kitchen-form\" ng-controller=\"SearchKitchenOrders\" class=\"ordersSearch\">\n" +
    "\t<form class=\"form-horizontal\" role=\"form\" ng-submit=\"submit()\">\n" +
    "\t\t<div class = \"topHalf\">\n" +
    "\t\t\t<div class=\"col-sm-6 form-group\">\n" +
    "\t\t\t\t<div>\n" +
    "\t\t\t\t\t<label for=\"inputStart\">Start Date</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"well well-small\" id=\"inputStart\" ng-model=\"startDate\" ng-change=\"startDateChanged(startDate)\">\n" +
    "\t\t\t\t\t<datepicker min=\"minDate\" show-weeks=\"showWeeks\"></datepicker>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"bottomHalf\">\n" +
    "\t\t\t<div class=\"form-group\">\n" +
    "\t\t\t\t<label for=\"inputCalendar\" class=\"col-sm-2 control-label\">Kitchen</label>\n" +
    "\t\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t\t<button class=\"btn btn-info\" type=\"button\" ng-controller=\"ListModal\"  ng-click=\"open('kitchens', modalTableData, null, kitchenCallback)\">Select</button>\n" +
    "\t\t\t\t\t\t{{params.kitchen ? params.kitchen + \" Selected\" : \"No Kitchen Selected\"}}\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<div class=\"col-sm-offset-2 col-sm-5 controls\">\n" +
    "\t\t\t\t<button type=\"submit\" class=\"btn btn-primary\">Search</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<div class=\"col-sm-offset-2 col-sm-5 controls\">\n" +
    "\t\t\t\t<button type=\"button\" class=\"btn btn-primary\" ng-click='download()'>Download</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "\t<div class=\"row-fluid\">\n" +
    "\t\t<div class=\"col-sm-12 pagination-centered\">\n" +
    "\t\t\t<div class=\"table-responsive\">\n" +
    "\t\t\t\t<table class=\"table table-bordered table-hover\">\n" +
    "\t\t\t\t\t<tr>\n" +
    "\t\t\t\t\t\t<th ng-repeat=\"column in displayTableData\" ng-click=\"predicate=column; reverse=!reverse;\">{{column.label}}</th>\n" +
    "\t\t\t\t\t</tr>\n" +
    "\t\t\t\t\t<tr ng-repeat=\"row in orders | filter:search | orderBy:predicate:reverse\" ng-click=\"select(row)\" ng-class=\"rowClass(row)\">\n" +
    "\t\t\t\t\t\t<td ng-repeat=\"column in displayTableData\">{{column.subfield ? row[column.field][column.subfield] : row[column.field]}}</td>\n" +
    "\t\t\t\t\t</tr>\n" +
    "\t\t\t\t</table>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t \n" +
    "</div>"
  );


  $templateCache.put('admin/orders/list.html',
    ""
  );


  $templateCache.put('admin/orders/search.html',
    "<div ng-controller=\"SearchOrdersCtrl\">\n" +
    "\t<div class = \"container\">\n" +
    "\t\t<div class =\"row-fluid\">\n" +
    "\t\t\t<div class=\"well span4 btn\" ng-click=\"view()\">\n" +
    "\t\t\t\t<h3>Create Order</h3>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"well span4 btn\" ng-click=\"kitchen()\">\n" +
    "\t\t\t\t\t<h3>Search Orders by Kitchen</h3>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"well span4 btn\" ng-click=\"user()\">\n" +
    "\t\t\t\t\t<h3>Search Orders by User</h3>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\t\n" +
    "</div>"
  );


  $templateCache.put('admin/orders/userSearch.html',
    "<div id=\"kitchen-form\" ng-controller=\"SearchUserOrders\" class=\"ordersSearch\">\n" +
    "\t<form class=\"form-horizontal\" role=\"form\" ng-submit=\"submit()\">\n" +
    "\t\t<div class = \"topHalf\">\n" +
    "\t\t\t<div class=\"col-sm-6 form-group\">\n" +
    "\t\t\t\t<div>\n" +
    "\t\t\t\t\t<label for=\"inputStart\">Start Date</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"well well-small\" id=\"inputStart\" ng-model=\"startDate\" ng-change=\"startDateChanged(startDate)\">\n" +
    "\t\t\t\t\t<datepicker min=\"minDate\" show-weeks=\"showWeeks\"></datepicker>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"col-sm-6 form-group\">\n" +
    "\t\t\t\t<div>\n" +
    "\t\t\t\t\t<label for=\"inputEnd\">End Date</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"well well-small\" id=\"inputEnd\" ng-model=\"endDate\" ng-change=\"endDateChanged(endDate)\">\n" +
    "\t\t\t\t\t<datepicker min=\"minDate\" show-weeks=\"showWeeks\"></datepicker>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"bottomHalf\">\n" +
    "\t\t\t<div class=\"form-group\">\n" +
    "\t\t\t\t<label for=\"inputCalendar\" class=\"col-sm-2 control-label\">User</label>\n" +
    "\t\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t\t<button class=\"btn btn-info\" type=\"button\" ng-controller=\"ListModal\"  ng-click=\"open('users', modalTableData, null, userCallback)\">Select</button>\n" +
    "\t\t\t\t\t{{params.user ? params.user + \" Selected\" : \"No User Selected\"}}\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<div class=\"col-sm-offset-2 col-sm-5 controls\">\n" +
    "\t\t\t\t<button type=\"submit\" class=\"btn btn-primary\">Search</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "\t<div class=\"row-fluid\">\n" +
    "\t\t<div class=\"span12 pagination-centered\">\n" +
    "\t\t\t<div class=\"table-responsive\">\n" +
    "\t\t\t\t<table class=\"table table-bordered table-hover\">\n" +
    "\t\t\t\t\t<tr>\n" +
    "\t\t\t\t\t\t<th ng-repeat=\"column in displayTableData\" ng-click=\"predicate=column; reverse=!reverse;\">{{column.label}}</th>\n" +
    "\t\t\t\t\t</tr>\n" +
    "\t\t\t\t\t<tr ng-repeat=\"row in orders | filter:search | orderBy:predicate:reverse\" ng-click=\"select(row)\" ng-class=\"rowClass(row)\">\n" +
    "\t\t\t\t\t\t<td ng-repeat=\"column in displayTableData\">{{column.subfield ? row[column.field][column.subfield] : row[column.field]}}</td>\n" +
    "\t\t\t\t\t</tr>\n" +
    "\t\t\t\t</table>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t \n" +
    "</div>"
  );


  $templateCache.put('admin/reviews/createOrModify.html',
    ""
  );


  $templateCache.put('admin/reviews/list.html',
    ""
  );


  $templateCache.put('admin/tags/createOrModify.html',
    "<div id=\"tag-form\" ng-controller=\"CreateOrModifyTagCtrl\">\n" +
    "\t<form class=\"form-horizontal createOrModifyForm\" role=\"form\" ng-submit=\"submit()\">\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputTag\" class=\"col-sm-2 control-label\">Tag</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputTag\" ng-model=\"tag.name\" placeholder=\"Tag\" value={{tag.name}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label for=\"inputPriority\" class=\"col-sm-2 control-label\">Priority</label>\n" +
    "\t\t\t<div class=\"col-sm-5 controls\">\n" +
    "\t\t\t\t<input type=\"number\" class=\"form-control\" id=\"inputPriority\" ng-model=\"tag.priority\" value={{tag.priority}}> \n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\t\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<div class=\"col-sm-offset-2 col-sm-5 controls\">\n" +
    "\t\t\t\t<button type=\"submit\" class=\"btn btn-primary\">Save</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "</div>"
  );


  $templateCache.put('admin/tags/list.html',
    "<div ng-controller=\"ListTagsCtrl\" class=\"listTable\">\n" +
    "\t<div class=\"modifiers\">\n" +
    "\t\t<div class=\"col-cs-4 pull-right\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"search\" placeholder=\"Search\"/>\n" +
    "\t\t</div>\n" +
    "\t\t<button type=\"button\" class=\"pull-left btn btn-primary\" ng-click=\"view()\" >+</button>\n" +
    "\t</div>\n" +
    "\t<div class=\"table-responsive\">\n" +
    "\t\t<table class=\"table table-bordered table-hover\">\n" +
    "\t\t\t<tr>\n" +
    "\t\t\t\t<th ng-click=\"predicate='tag'; reverse=!reverse;\">Name</th>\n" +
    "\t\t\t\t<th ng-click=\"predicate='priority'; reverse=!reverse;\">Allergy</th>\n" +
    "\n" +
    "\t\t\t</tr>\n" +
    "\t\t\t<tr ng-repeat=\"tag in tags | filter:search | orderBy:predicate:reverse\">\n" +
    "\t\t\t\t<td ng-click=\"view(tag)\">{{tag.name}}</td>\n" +
    "\t\t\t\t<td ng-click=\"view(tag)\">{{tag.priority}}</td>\n" +
    "\t\t\t</tr>\n" +
    "\t\t</table>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('admin/users/createOrModify.html',
    "<div id='create-user-form' ng-controller='CreateOrModifyUserCtrl'>\n" +
    "\t<form class='form-horizontal createOrModifyForm' role='form' ng-submit='submit()'>\n" +
    "\t\t<div class='form-group'>\n" +
    "\t\t\t<label for='inputName' class='col-sm-2 control-label'>Name</label>\n" +
    "\t\t\t<div class='col-sm-5 controls'>\n" +
    "\t\t\t\t<input type='text' class='form-control' required id='inputName' ng-model='user.name' placeholder='Name' value={{user.name}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='form-group'>\n" +
    "\t\t\t<label for='inputEmail' class='col-sm-2 control-label'>Email</label>\n" +
    "\t\t\t<div class='col-sm-5 controls'>\n" +
    "\t\t\t\t<input type='email' class='form-control' required id='inputEmail' ng-model='user.email' placeholder='Email' value={{user.email}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='form-group'>\n" +
    "\t\t\t<div class='edit-address pull-left col-sm-offset-1' user='user'></div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='form-group'>\n" +
    "\t\t\t<label for='inputCity' class='col-sm-2 control-label'>City</label>\n" +
    "\t\t\t<div class='col-sm-5 controls'>\n" +
    "\t\t\t\t<input type='text' class='form-control' required id='inputCity' ng-model='user.city' placeholder='City' value={{user.city | 'San Francisco'}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='form-group'>\n" +
    "\t\t\t<label for='inputPhone' class='col-sm-2 control-label'>Phone Number</label>\n" +
    "\t\t\t<div class='col-sm-5 controls'>\n" +
    "\t\t\t\t<input type='text' class='form-control' required id='inputPhone' ng-model='user.phone' placeholder='Phone Number' value={{user.phone}}>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='form-group'>\n" +
    "\t\t\t<label class='col-sm-2 control-label'>Quantity</label>\n" +
    "\t\t\t<div class='col-sm-5 controls'>\n" +
    "\t\t\t\t<div class='edit-qty' count='user.quantity'></div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='form-group'>\n" +
    "\t\t\t<label class='col-sm-2 control-label'>Delivery Time</label>\n" +
    "\t\t\t<div class='col-sm-5 controls'>\n" +
    "\t\t\t\t<div class='edit-delivery-time' time='user.deliveryTime.dinner'></div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='form-group'>\n" +
    "\t\t\t<label class='col-sm-2 control-label'>Delivery Days</label>\n" +
    "\t\t\t<div class='col-sm-5 controls'>\n" +
    "\t\t\t\t<div class='edit-delivery-days' user='user'></div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='form-group'>\n" +
    "\t\t\t<label for='inputSelectTags' class='col-sm-2 control-label'>Tags </label>\n" +
    "\t\t\t<div class='controls col-sm-4'>\n" +
    "\t\t\t\t<button class='btn btn-info' type='button' ng-controller='ListModal' ng-click='open(\"tags\", tableData, selectedTags, tagCallback)'>Change Tags</button>\n" +
    "\t\t\t\t<span class='form-control-static'>\n" +
    "\t\t\t\t\t{{user.tags ? user.tags.length + ' Tags Selected' : '0 Tags Selected'}}\n" +
    "\t\t\t\t</span>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='form-group'>\n" +
    "\t\t\t<label for='inputCredits' class='col-sm-2 control-label'>Meal Credits</label>\n" +
    "\t\t\t<div class='col-sm-5 controls'>\n" +
    "\t\t\t\t<input type='text' class='form-control' id='inputCredits' ng-model='user.mealCredits' placeholder='Meal Credits'>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='form-group'>\n" +
    "\t\t\t<label for='inputTip' class='col-sm-2 control-label'>Tip Amount</label>\n" +
    "\t\t\t<div class='col-sm-5 controls'>\n" +
    "\t\t\t\t<input type='text' class='form-control' id='inputTip' ng-model='user.tip' placeholder='Tip Amount'>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='form-group'>\n" +
    "\t\t\t<label class='col-sm-2 control-label'>Stripe Customer</label>\n" +
    "\t\t\t<div class='controls'>\n" +
    "\t\t\t\t<a ng-href='https://manage.stripe.com/customers/{{user.stripe_customer}}' target='_blank' class='col-sm-2 form-control-static action'>{{user.stripe_customer || 'No Stripe Customer'}}</a>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='form-group'>\n" +
    "\t\t\t<label for='inputFBID' class='col-sm-2 control-label'>Facebook ID</label>\n" +
    "\t\t\t<div class='col-sm-5 controls'>\n" +
    "\t\t\t\t<input type='text' class='form-control' id='inputFBID' ng-model='user.facebookId' placeholder='Facebook ID'>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='form-group'>\n" +
    "\t\t\t<label for='inputPassword3' class='col-sm-2 control-label'>Password</label>\n" +
    "\t\t\t<div class='col-sm-5 controls'>\n" +
    "\t\t\t\t<input type='password' class='form-control' id='inputPassword3' ng-model='user.password' placeholder='Password'>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='form-group'>\n" +
    "\t\t\t<div class='col-sm-offset-2 col-sm-5 controls'>\n" +
    "\t\t\t\t<div class='checkbox-inline'>\n" +
    "\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t<input type='checkbox' ng-model='user.isAdmin' ng-checked='{{user.isAdmin}}'> Is Admin?\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class='checkbox-inline'>\n" +
    "\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t<input type='checkbox' ng-model='user.paused' ng-checked='{{user.paused}}'> Paused?\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='form-group'>\n" +
    "\t\t\t<div class='col-sm-offset-2 col-sm-5 controls'>\n" +
    "\t\t\t\t<button id='submitUser' type='submit' class='btn btn-primary'>Save</button> <button id='submitUser' ng-click='delete()' type='button' class='btn btn-danger'>Delete</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "</div>"
  );


  $templateCache.put('admin/users/list.html',
    "<div ng-controller=\"ListUsersCtrl\" class=\"listTable\">\n" +
    "\t<div class=\"modifiers\">\n" +
    "\t\t<div class=\"col-cs-4 pull-right\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"search\" placeholder=\"Search\"/>\n" +
    "\t\t</div>\n" +
    "\t\t<button type=\"button\" class=\"pull-left btn btn-primary\" ng-click=\"view()\" >+</button>\n" +
    "\t</div>\n" +
    "\t<div class=\"table-responsive\">\n" +
    "\t\t<table class=\"table table-bordered table-hover\">\n" +
    "\t\t\t<tr>\n" +
    "\t\t\t\t<th ng-click=\"predicate='name'; reverse=!reverse;\">Name</th>\n" +
    "\t\t\t\t<th ng-click=\"predicate='email'; reverse=!reverse;\">Email</th>\n" +
    "\t\t\t\t<th ng-click=\"predicate='address'; reverse=!reverse;\">Address</th>\n" +
    "\t\t\t\t<th ng-click=\"predicate='phone'; reverse=!reverse;\">Phone</th>\n" +
    "\t\t\t\t<th ng-click=\"predicate='created_at'; reverse=!reverse;\">Date Joined</th>\n" +
    "\t\t\t\t<th>Actions</th>\n" +
    "\t\t\t</tr>\n" +
    "\t\t\t<tr ng-repeat=\"user in users | filter:search | orderBy:predicate:reverse\">\n" +
    "\t\t\t\t<td ng-click=\"view(user)\">{{user.name}}</td>\n" +
    "\t\t\t\t<td ng-click=\"view(user)\">{{user.email}}</td>\n" +
    "\t\t\t\t<td ng-click=\"view(user)\">{{user.address}}<span ng-hide=\"!user.address2\">{{', ' + user.address2}}</span>{{', ' + user.city}}</td>\n" +
    "\t\t\t\t<td ng-click=\"view(user)\">{{user.phone}}</td>\n" +
    "\t\t\t\t<td ng-click=\"view(user)\">{{user.created_at | date:'MM-dd-yyyy' }}</td>\n" +
    "\t\t\t\t<td><a ng-click=\"pause(user)\" class=\"action\">Pause</a></td>\n" +
    "\t\t\t</tr>\n" +
    "\t\t</table>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('admin/wrapper.html',
    "<div ng-controller=\"WrapperCtrl\">\n" +
    "\t<alert ng-repeat=\"alert in alerts\" type=\"alert.type\" close=\"closeAlert($index)\">{{alert.message}}</alert>\n" +
    "\t<div ui-view>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('directives/kitchen/createOrModifyCronJob.html',
    "<a class=\"closeBtn\" ng-click=\"close()\">x</a>\n" +
    "<h3>Cron Job</h3>\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <!-- Text input-->\n" +
    "        <div class=\"control-group\">\n" +
    "            <label class=\"control-label\" for=\"Weekday\">Weekday</label>\n" +
    "            <div class=\"controls\">\n" +
    "                <input id=\"Weekday\" name=\"Weekday\" ng-model=\"job.weekday\" type=\"text\" placeholder=\"Weekday\" class=\"input-xlarge\" required=\"\" value =\"{{job.weekday}}\">\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Select Basic -->\n" +
    "        <div class=\"control-group\">\n" +
    "            <label class=\"control-label\" for=\"module\">Job</label>\n" +
    "            <div class=\"controls\">\n" +
    "                <input id=\"Job\" name=\"Job\" ng-model=\"job.name\" type=\"text\" placeholder=\"Job Name\" class=\"input-xlarge\" required=\"\" value =\"{{job.name}}\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Text input-->\n" +
    "        <div class=\"control-group\">\n" +
    "            <label class=\"control-label\" for=\"time\">Time(UTC)</label>\n" +
    "            <div class=\"controls\">\n" +
    "                <input id=\"time\" name=\"time\" ng-model=\"job.cronTime\" type=\"text\" placeholder=\"Time\" class=\"input-xlarge\" required=\"\" value =\"{{job.cronTime}}\">\n" +
    "\n" +
    "            </div>\n" +
    "        </div> \n" +
    "       <!-- Text input-->\n" +
    "        <div class=\"control-group\">\n" +
    "            <label class=\"control-label\" for=\"customData\">Custom Data</label>\n" +
    "            <div class=\"controls\">\n" +
    "                <input id=\"customData\" ng-model=\"job.data\" value =\"{{job.data}}\" name=\"customData\" type=\"text\" placeholder=\"Custom Data\" class=\"input-xlarge\">\n" +
    "                <p class=\"help-block\">Enter object literal in string form e.g: {messageTime:'18:00:00'} or true for normal job</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "<div class='footer'>\n" +
    "    <button class='btn btn-inverse' ng-click='close()'>go back</button>\n" +
    "    <button class='btn btn-inverse' ng-click='delete(job)'>delete</button>\n" +
    "    <button class='btn btn-success' ng-click='ok()'>save</but ton>\n" +
    "</div>"
  );


  $templateCache.put('directives/kitchen/cronJob.html',
    "<div class=\"row-fluid\">\n" +
    "\t<div class=\"col-sm-12 pagination-centered\">\n" +
    "\t\t<div class=\"table-responsive\">\n" +
    "\t\t\t<table class=\"table table-bordered table-hover\">\n" +
    "\t\t\t\t<tr>\n" +
    "\t\t\t\t\t<th ng-repeat=\"column in displayTableData\" ng-click=\"predicate=column; reverse=!reverse;\">{{column.label}}</th>\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t\t<tr ng-repeat=\"job in jobList | filter:search | orderBy:predicate:reverse\" ng-click=\"jobEdit(job)\" ng-class=\"rowClass(job)\">\n" +
    "\t\t\t\t\t<td ng-repeat=\"column in displayTableData\">{{column.subfield ? job[column.field][column.subfield] : job[column.field]}}</td>\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t</table>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "<button type='button' class='btn btn-info' ng-click=\"jobEdit()\">Add Job</button>"
  );


  $templateCache.put('footer.html',
    "<div class=\"container\">\n" +
    "\t<span id=\"yelp-biz-badge-rc-Bm4Ob477oSh-EbXWh9PiwA\" class=\"yelpBadge\"><a href=\"http://yelp.com/biz/chefler-san-francisco\">Check Our Yelp</a></span>&nbsp;&nbsp;| Contact: <a href=\"mailto:help@chefler.com\">help@chefler.com</a> or 415-275-0535 | Copyright 2014 Chefler Inc.\n" +
    "</div>"
  );


  $templateCache.put('header.html',
    "<nav data-ng-controller=\"HeaderCtrl\" class=\"navbar-inner\">\n" +
    "    <div class=\"nav navbar-header\">\n" +
    "        <a class=\"logoContainer\" href=\"/\"><img class=\"logo\" src=\"/img/logo.png\"></a>\n" +
    "    </div>\n" +
    "    <ul class=\"nav navbar-nav navbar-right\" data-ng-hide=\"global.authenticated\">\n" +
    "        <li><a ui-sref=\"index.login\" id=\"headerLogin\">Login</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <ul class=\"nav navbar-nav navbar-right\" data-ng-show=\"global.authenticated\">\n" +
    "        <li ng-show=\"global.public\" ng-class=\"isSelected('mealplan')\">\n" +
    "            <a ui-sref='mealplan'>Meal plan</a>\n" +
    "        </li>\n" +
    "        <li ng-show=\"global.public\" ng-class=\"isSelected('settings')\">\n" +
    "            <a ui-sref='settings'>Settings</a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a href=\"/signout\" id=\"headerLogout\">Logout</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>"
  );


  $templateCache.put('public/directives/login.html',
    "<div class=\"modalHeader\">Welcome back!<br>Please login to your account</div>\n" +
    "<div class=\"loginOptions\">\n" +
    "\t<button id=\"facebookLogin\" class=\"btn fbButton\" ng-click=\"fbLogin()\">Login with facebook</button>\n" +
    "\t<div class=\"divider\">\n" +
    "\t\t<div class=\"line\"></div><div class=\"or\">or</div><div class=\"line\"></div>\n" +
    "\t</div>\n" +
    "\t<input type=\"text\" name=\"email\" ng-model=\"email\" class=\"form-control\" ng-change=\"clearErrors()\" ui-keypress=\"{13: 'login()'}\" placeholder=\"email address\">\n" +
    "\t<alert class=\"errorText alert alert-danger\" id=\"loginEmailError\" ng-show=\"errors.email\">{{errors.email}}</alert>\n" +
    "\t<input type=\"password\" name=\"password\" ng-model=\"password\" class=\"form-control\" ng-change=\"clearErrors()\" ui-keypress=\"{13: 'login()'}\" placeholder=\"password\">\n" +
    "\t<a class=\"forgotText\" ng-click=\"forgotPassword()\">forgot?</a>\n" +
    "\t<div class=\"buttonContainer\">\n" +
    "\t\t<a ui-sref=\"index\" class=\"btn btn-inverse signupButton\" id='loginBack'>back</a>\n" +
    "\t\t<a class=\"btn btn-success signupButton\" id='loginButton' ng-click='login()'>login</a>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('public/directives/mealplan/cancelMeal.html',
    "<a class=\"closeBtn\" ng-click=\"close()\">×</a>\n" +
    "<h3>Cancel meal?</h3>\n" +
    "<p>Are you sure you'd like to cancel this meal?</p>\n" +
    "<div class='footer'>\n" +
    "\t<button class='btn btn-inverse' ng-click='close()'>cancel</button>\n" +
    "\t<button class='btn btn-warning' ng-click='ok()'>submit</button>\n" +
    "</div>"
  );


  $templateCache.put('public/directives/mealplan/editAddress.html',
    "<a class=\"closeBtn\" ng-click=\"dismiss()\">×</a>\n" +
    "\n" +
    "<h3> Delivery address for this day?</h3>\n" +
    "<div class=\"edit-address\" continue=\"submit\" dismiss=\"cancel\" user='deliveryData'></div>"
  );


  $templateCache.put('public/directives/mealplan/editDeliveryTime.html',
    "<a class=\"closeBtn\" ng-click=\"dismiss()\">×</a>\n" +
    "<h3>Delivery window on this day</h3>\n" +
    "<div class=\"edit-delivery-time\" time=\"deliveryData.time\" morningCutoff=\"deliveryData.morningCutoff\"></div>\n" +
    "<a ng-click=\"dismiss()\" class=\"btn btn-inverse\" id='editDaysCancel'>cancel</a>\n" +
    "<a ng-click=\"close()\" class=\"btn btn-warning\" id='editDaysOk'>submit</a>"
  );


  $templateCache.put('public/directives/mealplan/editMealOrQuantity.html',
    "<a class=\"closeBtn\" ng-click=\"close()\">×</a>\n" +
    "<div class='changeQuantityContainer'>\n" +
    "\t<div class='editMeal' ng-repeat='meal in meals'>\n" +
    "\t\t<img ng-src=\"{{meal.meal.images[0]}}\"/>\n" +
    "\t\t<div class=\"mealName\">{{meal.meal.name}}</div>\n" +
    "\t\t<p>{{meal.meal.description}}</p>\n" +
    "\t\t<div class=\"edit-qty\" count='meal.quantity' min=0></div>\n" +
    "\t</div> \n" +
    "</div>\n" +
    "<button class=\"btn btn-warning\" ng-click='save()'>select</button>\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('public/directives/mealplan/mealplanRow.html',
    "<div class='imageCont'>\n" +
    "\t<img ng-src='{{shownMeal.images[0]}}'/>\n" +
    "</div>\n" +
    "<div class='mealInfo' ng-class=\"{enabled: enabled}\">\n" +
    "\t<div class='mealDate'>\n" +
    "\t\t<h3>{{shownMeal.userTime}}</h3>\n" +
    "\t</div>\n" +
    "\t<div class='mealName'>\n" +
    "\t\t{{shownMeal.name}}\n" +
    "\t</div>\n" +
    "\t<div class='mealDescription'>\n" +
    "\t\t{{shownMeal.description}}\n" +
    "\t</div>\n" +
    "\t<div>\n" +
    "\t\t<a class='mealNutrition' ng-class=\"{enabled: enabled}\" tooltip-html-unsafe=\"{{shownMeal.viewInfo}}\" tooltip-placement=\"right\" tooltip-popup-delay='100'>view nutritional info</a>\n" +
    "\t</div>\n" +
    "\t<div class='mealButtons' data-ng-hide=\"enabled\">\n" +
    "\t\t<div class='btn btn-warning addMealButton' ng-click='addMeal()'>\n" +
    "\t\t\t<div class='buttonText'>Add Meal</div>\n" +
    "\t\t\t<div class='timeRemaining'>{{shownMeal.quantityTimeRemaining}}</div>\n" +
    "\t\t\t<div class='disabledTimeRemaining'>----</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='btn btn-warning editMealOrQuantityButton' ng-click='editMealOrQuantity()'>\n" +
    "\t\t\t<div class='buttonText'>Edit Meal or Qty</div>\n" +
    "\t\t\t<div class='timeRemaining'>{{shownMeal.quantityTimeRemaining}}</div>\n" +
    "\t\t\t<div class='disabledTimeRemaining'>----</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class='mealButtons' data-ng-show=\"enabled\">\n" +
    "\t\t<div class='btn btn-success editMealOrQuantityButton' ng-click='editMealOrQuantity()'>\n" +
    "\t\t\t<div class='buttonText'>Edit Meal or Qty</div>\n" +
    "\t\t\t<div class='timeRemaining'>{{shownMeal.quantityTimeRemaining}}</div>\n" +
    "\t\t\t<div class='disabledTimeRemaining'>----</div>\n" +
    "\n" +
    "\t\t</div>\n" +
    "\t\t<div class='btn btn-success editScheduleButton'  ng-click='editTime()'>\n" +
    "\t\t\t<div class='buttonText'>Edit Schedule</div>\n" +
    "\t\t\t<div class='timeRemaining'>{{shownMeal.deliveryTimeRemaining}}</div>\n" +
    "\t\t\t<div class='disabledTimeRemaining'>----</div>\n" +
    "\n" +
    "\t\t</div>\n" +
    "\t\t<div class='btn btn-success editAddressButton'  ng-click='editAddress()'>\n" +
    "\t\t\t<div class='buttonText'>Edit Address</div>\n" +
    "\t\t\t<div class='timeRemaining'>{{shownMeal.deliveryTimeRemaining}}</div>\n" +
    "\t\t\t<div class='disabledTimeRemaining'>----</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class='btn btn-success cancelMealButton'  ng-click='cancelMeal()'>\n" +
    "\t\t\t<div class='buttonText'>Cancel Meal</div>\n" +
    "\t\t\t<div class='timeRemaining'>{{shownMeal.quantityTimeRemaining}}</div>\n" +
    "\t\t\t<div class='disabledTimeRemaining'>----</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('public/directives/signup/addressModal.html',
    "<div class=\"modalHeader\">Where would you typically like your meals delivered?</div>\n" +
    "<div class=\"subHeader\">You can easily change your address, even for a particular meal. Deliver to home or work.</div>\n" +
    "<div class=\"edit-address\" user=\"user\" dismiss=\"go back\" continue=\"continue\"></div>\n" +
    "<div class=\"progressBar\">\n" +
    "\t<img ng-src=\"/img/progress/progressbar3.png\">\n" +
    "</div>"
  );


  $templateCache.put('public/directives/signup/authTypeModal.html',
    "<div class=\"modalHeader\">Please complete your profile</div>\n" +
    "<div class=\"authButtons\">\n" +
    "\t<a ng-click=\"facebookAuth()\" class=\"btn btn-info fbButton\">sign up with facebook</a>\n" +
    "\t<div class=\"divider\">\n" +
    "\t\t<div class=\"line\"></div><div class=\"or\">or</div><div class=\"line\"></div>\n" +
    "\t</div>\n" +
    "\t<a ng-click=\"emailAuth()\" class=\"btn btn-inverse\" id='emailAuth'>sign up with email</a>\n" +
    "</div>\n" +
    "<div class=\"buttonContainer\">\n" +
    "\t<a ui-sref=\"index.address\" class='btn btn-inverse' id='emailBack'>go back</a>\n" +
    "</div>\n" +
    "<div class=\"progressBar\">\n" +
    "\t<img ng-src=\"/img/progress/progressbar4.png\">\n" +
    "</div>"
  );


  $templateCache.put('public/directives/signup/daysTimeModal.html',
    "<div class='modalHeader'>What time would you typically like your dinners delivered?</div>\n" +
    "<div class='subHeader'>You can easily change your schedule any week or day.</div>\n" +
    "<div id='pickDaysContainer'>\n" +
    "\t<span class=\"dayHeader\">Default delivery days (pick {{daysSelected}})</span>\n" +
    "\t<div class='edit-delivery-days' user='user'></div>\n" +
    "</div>\n" +
    "<div id='pickTimeContainer'>\n" +
    "\t<span class=\"timeHeader\">Default delivery window</span>\n" +
    "\t<div class='edit-delivery-time' time='user.deliveryTime.dinner'></div>\n" +
    "</div>\n" +
    "<div class='buttonContainer'>\n" +
    "\t<a ui-sref='index.mealsPerWeek' class='btn btn-inverse signupButton' id='dayTimeBack'>go back</a>\n" +
    "\t<a ng-click=\"address()\" class='btn btn-warning signupButton' id='dayTimeContinue'>continue</a>\n" +
    "</div>\n" +
    "<div class='progressBar'>\n" +
    "\t<img ng-src='/img/progress/progressbar2.png'>\n" +
    "</div>"
  );


  $templateCache.put('public/directives/signup/emailModal.html',
    "<div class=\"modalHeader\">Please complete your profile</div>\n" +
    "<div id=\"loginInfo\" class=\"form-horizontal\">\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label for=\"inputEmail\">Email</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-change=\"updateErrors()\" required id=\"inputEmail\" ng-model=\"user.email\" ui-keypress=\"{13: 'submit()'}\" placeholder=\"for receipts\">\n" +
    "\t\t<alert class=\"errorText alert alert-danger\" id=\"emailError\" ng-show=\"showErrors && errors.email\">{{errors.email}}</alert>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label for=\"inputPassword\">Choose password</label>\n" +
    "\t\t<input type=\"password\" class=\"form-control\" ng-change=\"updateErrors()\" id=\"inputPassword\" ng-model=\"user.password\" ui-keypress=\"{13: 'submit()'}\">\n" +
    "\t\t<alert class=\"errorText alert alert-danger\" id=\"passwordError\" ng-show=\"showErrors && errors.password\">{{errors.password}}</alert>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label for=\"inputPasswordVerify\">Confirm password</label>\n" +
    "\t\t<input type=\"password\" class=\"form-control\" ng-change=\"updateErrors()\" required id=\"inputPasswordVerify\" ng-model=\"passwordVerify\" ui-keypress=\"{13: 'submit()'}\">\n" +
    "\t\t<alert class=\"errorText alert alert-danger\" id=\"confirmPasswordError\" ng-show=\"showErrors && errors.confirmPassword\">{{errors.confirmPassword}}</alert>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "<div class=\"buttonContainer\">\n" +
    "\t<a ui-sref=\"index.authType\" class=\"btn btn-inverse signupButton\" id=\"emailBack\">go back</a>\n" +
    "\t<a ng-click=\"submit()\" class=\"btn btn-warning signupButton\" id=\"emailContinue\">continue</a>\n" +
    "</div>\n" +
    "<div class=\"progressBar\">\n" +
    "\t<img ng-src=\"/img/progress/progressbar4.png\">\n" +
    "</div>"
  );


  $templateCache.put('public/directives/signup/homeModal.html',
    "<div class='modalHeader'>\n" +
    "\tHealthy meal plans for busy people\n" +
    "</div>\n" +
    "<div class='divider'></div>\n" +
    "<div id='sellingPoints'>\n" +
    "\t<div class='point'>\n" +
    "\t\t<div class='header'>Healthy</div>\n" +
    "\t\t<div class='body'>\n" +
    "\t\t\tWholesome ingredients that marry great taste with great nutrition.\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class='point'>\n" +
    "\t\t<div class='header'>Convenient</div>\n" +
    "\t\t<div class='body'>\n" +
    "\t\t\tChef prepared meals delivered to you; no cooking or dirty dishes.\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class='point'>\n" +
    "\t\t<div class='header'>No Commitments</div>\n" +
    "\t\t<div class='body'>\n" +
    "\t\t\tOnly pay for meals delivered. Change or cancel easily.\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "<div class='buttonContainer'>\n" +
    "\t<a ng-click=\"mealsPerWeek()\" class=\"btn btn-success signupButton\" id=\"startFlowButton\">\n" +
    "\t\tSelect a meal plan\n" +
    "\t</a>\n" +
    "</div>"
  );


  $templateCache.put('public/directives/signup/mealsPerWeekModal.html',
    "<div class='modalHeader'>How many dinners would you typically like delivered Mondays to Thursdays?</div>\n" +
    "<div class='subHeader'>Cancel meals any day. Only pay for delivered meals. $2 delivery.</div>\n" +
    "<div class='meals-per-week' id=\"mealsPerWeek\" user=\"user\"></div>\n" +
    "<div class='buttonContainer'>\n" +
    "\t<div class=\"veggieContainer\">\n" +
    "\t\t<span class=\"veggie\">Vegetarian?</span>\n" +
    "\t\t<input class=\"veggieCheckbox\" type=\"checkbox\" ng-model=\"vegetarian\" ng-checked=\"{{vegetarian}}\">\n" +
    "\t</div>\n" +
    "\t<div>\n" +
    "\t\t<a ng-click=\"daysAndTime()\" class=\"btn btn-warning signupButton\" id='mealsPerWeekContinue'>continue</a>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "<div class='progressBar'>\n" +
    "\t<img ng-src=\"/img/progress/progressbar1.png\">\n" +
    "</div>"
  );


  $templateCache.put('public/directives/signup/paymentInfoModal.html',
    "<div class=\"modalHeader\">Please complete your profile</div>\n" +
    "<div class=\"subHeader\">You'll only be charged for meals delivered. Cancel anytime.</div>\n" +
    "<div class=\"edit-payment-info\"></div>\n" +
    "<div class=\"securityInfo\">\n" +
    "\tAll transactions are secure and encrypted, and we never store your credit card info. To learn more please view our <a ng-click=\"privacyPolicyModal()\">Privacy Policy</a>. By signing up you agree to our <a ng-click=\"tosModal()\">Terms & Conditions</a>\n" +
    "</div>\n" +
    "<div class=\"progressBar\">\n" +
    "\t<img ng-src=\"/img/progress/progressbar5.png\">\n" +
    "</div>"
  );


  $templateCache.put('public/directives/upcomingMeals.html',
    "<div class=\"tags\">\n" +
    "\tsample meals this week: <a ng-click=\"setTag('none')\" ng-class=\"{'selected': tag==='none'}\">non-vegetarian</a> | <a ng-click=\"setTag('veggie')\" ng-class=\"{'selected': tag==='veggie'}\">vegetarian</a>\n" +
    "</div>\n" +
    "<div id=\"mealImageContainer\" class=\"fade\" ng-class=\"{'in': tagChanging===false}\">\n" +
    "\t<div ng-repeat=\"mealObj in upcomingMeals[tag] track by $index\" class=\"mealImage\">\n" +
    "\t\t<img ng-src={{mealObj.images[0]}}>\n" +
    "\t\t<div class=\"mealImageNameBackground\"></div>\n" +
    "\t\t<div class=\"mealImageName\">{{mealObj.name}}</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('public/directives/user/editAddress.html',
    "<div class=\"form-group\">\n" +
    "\t<label for=\"inputAddress\" class=\"control-label\">Street Address</label>\n" +
    "\t<input type=\"text\" class=\"form-control\" ng-change=\"updateErrors()\" id=\"inputAddress\" ng-model=\"user.address\" ui-keypress=\"{13: 'submit()'}\" required>\n" +
    "\t<alert class=\"errorText alert alert-danger\" id=\"addressError\" ng-show=\"showErrors && errors.address\">{{errors.address}}</alert>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "\t<label for=\"inputAddress2\" class=\"control-label\">Unit number</label>\n" +
    "\t<input type=\"text\" class=\"form-control\" id=\"inputAddress2\" ng-model=\"user.address2\" ui-keypress=\"{13: 'submit()'}\" placeholder=\"if applicable\">\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "\t<label for=\"inputZip\" class=\"control-label\">Zip code</label>\n" +
    "\t<input type=\"text\" class=\"form-control\"  ng-change=\"updateErrors()\" id=\"inputZip\" ng-model=\"user.zip\" ui-keypress=\"{13: 'submit()'}\" required>\n" +
    "\t<alert class=\"errorText alert alert-danger\" id=\"zipError\" ng-show=\"showErrors && errors.zip\">{{errors.zip}}</alert>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "\t<label for=\"inputInstructions\" class=\"control-label instructionsLabel\">Special delivery instructions <span class=\"unbold\">(optional)</span></label>\n" +
    "\t<textarea class=\"form-control\" id=\"inputInstructions\" ng-model=\"user.instructions\" placeholder=\"E.g. dial 555 on intercom\" rows=3></textarea>\n" +
    "</div>\n" +
    "<div class=\"buttonContainer\">\n" +
    "\t<a ng-click=\"cancel()\" class=\"btn btn-inverse signupButton\" id='addressDismiss' ng-show=\"dismiss\">{{dismiss}}</a>\n" +
    "\t<a ng-click=\"submit()\" class=\"btn btn-warning signupButton\" id='addressContinue' ng-show=\"continue\">{{continue}}</a>\n" +
    "</div>"
  );


  $templateCache.put('public/directives/user/editDeliveryDays.html',
    "<button type=\"button\" ng-repeat=\"day in deliveryDays\" ng-class=\"isSelected(day.day)\" ng-click=\"select(day.day)\" class=\"btn\">{{day.abbrev}}</button>"
  );


  $templateCache.put('public/directives/user/editDeliveryTime.html',
    "<div class=\"period\" ng-repeat=\"period in deliveryTimes\">\n" +
    "\t<button type=\"button\" ng-repeat=\"(time, readable) in period track by $index\" ng-class=\"isSelected(time)\" ng-click=\"select(time)\" class=\"btn\">{{readable}}</button>\n" +
    "</div>"
  );


  $templateCache.put('public/directives/user/editPaymentInfo.html',
    "<div class=\"form-group\">\n" +
    "\t<label for=\"inputName\">Full name</label>\n" +
    "\t<input type=\"text\" class=\"form-control\" ng-change=\"updateErrors()\" required id=\"inputName\" ng-model=\"user.name\">\n" +
    "\t<alert class=\"errorText alert alert-danger\" id=\"nameError\" ng-show=\"showErrors && errors.name\">{{errors.name}}</alert>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-show=\"signupInfo\">\n" +
    "\t<label for=\"inputPhone\">Phone #</label>\n" +
    "\t<input type=\"text\" class=\"form-control\" ng-change=\"updateErrors()\" id=\"inputPhone\" ng-model=\"user.phone\"  placeholder=\"For SMS order status\">\n" +
    "\t<alert class=\"errorText alert alert-danger\" id=\"phoneError\" ng-show=\"showErrors && errors.phone\">{{errors.phone}}</alert>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "\t<label for=\"inputCard\">Credit card #</label>\n" +
    "\t<input type=\"text\" class=\"form-control\" ng-change=\"updateErrors()\" required id=\"inputCard\" ng-model=\"cardNumber\">\n" +
    "\t<alert class=\"errorText alert alert-danger\" id=\"cardError\" ng-show=\"showErrors && errors.card\">{{errors.card}}</alert>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "\t<label for=\"inputMonth\">Exp. date</label>\n" +
    "\t<input type=\"text\" class=\"form-control smallInput\" ng-change=\"updateErrors()\" id=\"inputMonth\" ng-model=\"expMonth\" placeholder=\"MM\">\n" +
    "\t<input type=\"text\" class=\"form-control smallInput\" ng-change=\"updateErrors()\" id=\"inputYear\" ng-model=\"expYear\" placeholder=\"YYYY\">\n" +
    "\t<alert class=\"errorText alert alert-danger\" id=\"expirationError\" ng-show=\"showErrors && errors.expiration\">{{errors.expiration}}</alert>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "\t<label for=\"inputCVC\">Security code</label>\n" +
    "\t<input type=\"text\" class=\"form-control smallInput\" ng-change=\"updateErrors()\" required id=\"inputCVC\" ng-model=\"cvc\">\n" +
    "\t<alert class=\"errorText alert alert-danger small\" id=\"cvcError\" ng-show=\"showErrors && errors.cvc\">{{errors.cvc}}</alert>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "\t<label for=\"inputZip\">Billing zip</label>\n" +
    "\t<input type=\"text\" class=\"form-control smallInput\" ng-change=\"updateErrors()\" required id=\"inputZip\" ng-model=\"billingZip\">\n" +
    "\t<alert class=\"errorText alert alert-danger small\" id=\"billingZipError\" ng-show=\"showErrors && errors.zip\">{{errors.zip}}</alert>\n" +
    "</div>\n" +
    "<div class=\"form-group\" ng-show=\"signupInfo\">\n" +
    "\t<label for=\"inputCoupon\">Promo code?</label>\n" +
    "\t<input type='checkbox' class=\"promoCheck\" ng-model='showPromo' ng-show='!showPromo' ng-checked='{{showPromo}}'>\n" +
    "\t<input type=\"text\" class=\"form-control smallInput\" ng-change=\"updateErrors()\" required id=\"inputCoupon\" ng-model=\"couponCode\" ng-show=\"showPromo\">\n" +
    "\t<alert class=\"errorText alert alert-danger small\" id=\"couponError\" ng-show=\"showErrors && errors.coupon\">{{errors.coupon}}</alert>\n" +
    "</div>\n" +
    "<div class=\"buttonContainer\">\n" +
    "\t<a ng-click=\"cancel()\" class=\"btn btn-inverse signupButton\" id='paymentBack'>{{dismiss}}</a>\n" +
    "\t<a ng-click=\"submit()\" class=\"btn btn-warning signupButton\" id='paymentContinue'>{{continue}}</a>\n" +
    "</div>"
  );


  $templateCache.put('public/directives/user/editQty.html',
    "<button type='button' class='tallButton' id='decreaseQty' ng-click='updateQty(-1)'>-</button>\n" +
    "<div id='qtyContainer'><h4>{{count}}</h4></div>\n" +
    "<button type='button' class='tallButton' id='increaseQty' ng-click='updateQty(1)'>+</button>\n" +
    "\n"
  );


  $templateCache.put('public/directives/user/mealsPerWeek.html',
    "<div id=\"mealsPerWeekContainer\">\n" +
    "\t<button ng-repeat=\"meals in mealData\" ng-click=\"select(meals.count)\" class=\"longButton\" ng-class=\"isSelected(meals.count)\">\n" +
    "\t\t<span class=\"count\">{{meals.count}} meal{{meals.count !== 1 ? 's': ''}} per week</span>\n" +
    "\t\t<div class=\"mealPrice pull-right\">\n" +
    "\t\t\t<div class=\"priceText pull-left\">\n" +
    "\t\t\t\t<span class=\"strike fullPrice\" ng-if=\"meals.discountPrice\">{{meals.fullPrice}}</span>\n" +
    "\t\t\t\t<span class=\"red discountPrice\" ng-if=\"meals.discountPrice\">{{meals.discountPrice}}</span>\n" +
    "\t\t\t\t<span class=\"fullPrice\" ng-if=\"!meals.discountPrice\">{{meals.fullPrice}}</span>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"tinyMealText\">per meal delivered</div>\n" +
    "\t\t</div>\n" +
    "\t</button>\n" +
    "</div>"
  );


  $templateCache.put('public/home/forgotPassword.html',
    "<a class=\"closeBtn\" ng-click=\"dismiss()\">x</a>\n" +
    "<h3>Forgot your password?</h3>\n" +
    "<div class=\"subHeader\">Enter your email below to receive a new one!</div>\n" +
    "<input ng-model=\"email\" placeholder=\"email\" ng-change=\"updateErrors()\"/>\n" +
    "<alert class=\"errorText alert alert-danger\" ng-show=\"showErrors && errors.forgotEmail\">{{errors.forgotEmail}}</alert>\n" +
    "<alert class=\"errorText alert alert-success\" ng-show=\"success.forgotEmail\">{{success.forgotEmail}}</alert>\n" +
    "<div class=\"buttonContainer\">\n" +
    "\t<a class=\"btn btn-success\" ng-click=\"sendEmail(email)\">submit</a>\n" +
    "</div>"
  );


  $templateCache.put('public/home/home.html',
    "<div id=\"signupContainerWrapper\">\n" +
    "\t<div id=\"signupContainer\" ng-controller=\"SignupCtrl\" ng-class=\"stepClass()\">\n" +
    "\t\t<div id=\"spinner\" ng-show=\"showSpinner\">\n" +
    "\t\t\t<div id=\"spinnerContainer\">\n" +
    "\t\t\t\t<div class=\"f_circleG\" id=\"frotateG_01\"></div>\n" +
    "\t\t\t\t<div class=\"f_circleG\" id=\"frotateG_02\"></div>\n" +
    "\t\t\t\t<div class=\"f_circleG\" id=\"frotateG_03\"></div>\n" +
    "\t\t\t\t<div class=\"f_circleG\" id=\"frotateG_04\"></div>\n" +
    "\t\t\t\t<div class=\"f_circleG\" id=\"frotateG_05\"></div>\n" +
    "\t\t\t\t<div class=\"f_circleG\" id=\"frotateG_06\"></div>\n" +
    "\t\t\t\t<div class=\"f_circleG\" id=\"frotateG_07\"></div>\n" +
    "\t\t\t\t<div class=\"f_circleG\" id=\"frotateG_08\"></div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"pleaseWait\">May take a few seconds.<br>Please do not refresh.</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"login transparentModal\" ng-class=\"{offScreen: step < -1, slideOut: step > -1, invis: step > -1 && !initComplete, notransition: global.isMobile}\"></div>\n" +
    "\t\t<div class=\"home-modal transparentModal\" ng-class=\"{offScreen: step < 0, slideOut: step > 0, notransition: global.isMobile}\"></div>\n" +
    "\t\t<div class=\"meals-per-week-modal transparentModal\" ng-class=\"{offScreen: step < 1, slideOut: step > 1, invis: step < 1 && !initComplete, notransition: global.isMobile}\"></div>\n" +
    "\t\t<div class=\"days-time-modal transparentModal\" ng-class=\"{offScreen: step < 2, slideOut: step > 2, invis: step < 1 && !initComplete, notransition: global.isMobile}\"></div>\n" +
    "\t\t<div class=\"address-modal transparentModal\" user=\"user\" ng-class=\"{offScreen: step < 3, slideOut: step > 3, invis: step < 1 && !initComplete, notransition: global.isMobile}\"></div>\n" +
    "\t\t<div class=\"auth-type-modal transparentModal\" ng-class=\"{offScreen: step < 4, slideOut: step > 4, invis: step < 1 && !initComplete, notransition: global.isMobile}\"></div>\n" +
    "\t\t<div class=\"email-modal transparentModal\" user=\"user\" ng-class=\"{offScreen: step < 5 || user.facebookId, slideOut: step > 5 && !user.facebookId, invis: step < 1 && !initComplete, notransition: global.isMobile}\"></div>\n" +
    "\t\t<div class=\"payment-info-modal transparentModal\" user=\"user\" coupon-code=\"couponCode\" create-user=\"createUser\" ng-class=\"{offScreen: step < 6, slideOut: step > 6, invis: step < 1 && !initComplete, notransition: global.isMobile}\"></div>\n" +
    "\t</div>\n" +
    "\t<div id=\"push\"></div>\n" +
    "</div>\n" +
    "<div id=\"upcomingMealsContainer\">\n" +
    "\t<div id=\"pricingMessage\">Meals start from $7. $2 delivery.</div>\n" +
    "\t<div id=\"upcomingMeals\" upcoming-meals></div>\n" +
    "</div>"
  );


  $templateCache.put('public/home/mealplan.html',
    "<div ng-controller=\"WrapperCtrl\">\n" +
    "\t<div class=\"alertContainer\">\n" +
    "\t\t<div ng-repeat=\"alert in alerts\" ng-class=\"{transparent: alert.dismissed}\" class=\"alertWrapper\" ng-show=\"!alert.hidden\">\n" +
    "\t\t\t<alert  type=\"alert.type\" close=\"closeAlert($index)\">{{alert.message}}</alert>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"contentContainer\" ng-controller=\"MealplanCtrl\">\n" +
    "\t\t<div class='mealplanContainer'>\n" +
    "\t\t\t<div class='col-md-12 promoText' data-ng-show=\"promoText\">\n" +
    "\t\t\t\t{{promoText}}\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div ng-repeat=\"mealplanRow in user.mealplan\" class='mealplan-row' ng-class='mealplanRow.status' meals='mealplanRow.meals' shown-meal='mealplanRow.shownMeal' delivery-data='mealplanRow.deliveryData' enabled='mealplanRow.enabled' status='mealplanRow.status' ></div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('public/home/privacyPolicy.html',
    "<a class=\"closeBtn\" ng-click=\"close()\">x</a>\n" +
    "<div class=\"termsModal\">\n" +
    "Privacy Policy<br>\n" +
    "<br>\n" +
    "Chefler Inc.<br>\n" +
    "<br>\n" +
    "PRIVACY STATEMENT<br>\n" +
    "Last modified August 26, 2013 <br>\n" +
    "<br>\n" +
    "Introduction<br>\n" +
    "Chefler Inc. operates the web site at www.chefler.com (\"Site\"). We respect the privacy of each user of the Site (referred to as \"you\" or \"a user\"), whether you are just beginning your real estate search or have previously visited our Site. This Privacy Statement gives you specific information about how we protect your privacy, how we treat information we collect on the Site that identifies an individual user (\"Personal Information\"), and how we use aggregated information.<br>\n" +
    "<br>\n" +
    "BY REGISTERING FOR OR USING THE SITE, YOU SIGNIFY YOUR ACCEPTANCE OF THIS PRIVACY STATEMENT. IF YOU DO NOT AGREE TO THIS PRIVACY STATEMENT, YOU CANNOT USE THE SITE. We reserve the right to modify this Statement at any time by posting a notice on the Site's home page. (If we consider it appropriate, we may also provide additional notice of significant changes.) Your use of the Site after the date of the last modification listed at the beginning of this Privacy Statement indicates to us that you agree to the changes.<br>\n" +
    "<br>\n" +
    "Location of Servers and Transfer of Information to the United States<br>\n" +
    "The Site is hosted by servers in the United States. By submitting your Personal Information, you consent to its use in accordance with this Privacy Statement.<br>\n" +
    "<br>\n" +
    "Scope of this Privacy Statement<br>\n" +
    "This Privacy Statement applies to your use of this Site only. This Web Site may contain links to other web sites (\"Linked Sites\"). The Linked Sites are provided for your convenience and information only and, as such, you access them at your own risk. The content of any Linked Sites is not under Chefler Inc. 's control, and Chefler Inc. is not responsible for, and does not endorse, such Linked Sites privacy policy, or to its collection, use, storage and disclosure of your Personal Information.<br>\n" +
    "<br>\n" +
    "1. Collection and Use of Your Personal Information<br>\n" +
    "We collect your Personal Information on the Site in order to enhance the services we offer you. We collect Personal Information from you only when you voluntarily submit it in order to obtain certain services or information, including (A) registrations for special communications: (B) purchasing meal plans for delivery; (C) requests to contact you; and (D) when you post comments.<br>\n" +
    "If you contact us, we collect Personal Information, which is retained or referred to a rental associate depending on the nature of your inquiry. If you are looking for a rental property, it is referred to a rental associate; if your inquiry or complaint requires a response from us, it is referred to the appropriate department for research and a response. The information we collect is not used in any other way and is not retained after one year. You retain all rights to your data.<br>\n" +
    "<br>\n" +
    "2. Collection of Non-Personal Information<br>\n" +
    "Even if you do not send us any Personal Information, we collect information about how you use our site (\"Non-Personal Information\"). This information cannot be used to identify you personally and is explained in more detail below under \"Non-Personal Information\".<br>\n" +
    "<br>\n" +
    "Cookies<br>\n" +
    "A cookie is a small data file, often including an anonymous unique identifier, that is sent from a web site's computer and stored on your computer's hard drive. Use of cookies is common on the Internet. A web site can send its own cookie to your browser if your browser's preferences allow it, but (to protect your privacy) your browser permits a web site to access only the cookies it has already sent to you, not the cookies sent to you by other sites. You can configure your browser to accept all cookies, reject all cookies, or notify you when a cookie is sent. (Each browser is different, so check the \"Help\" menu of your browser to learn how to change your cookie preferences.) You can reset your browser to refuse all cookies or indicate when a cookie is being sent. But if you refuse cookies, some parts of the Site will not function properly and may not provide services or information you have requested. For example, without cookies, we will not be able to provide you with searches that you have asked us to sav.<br>\n" +
    "<br>\n" +
    "Non-Personal Information<br>\n" +
    "Like many sites, we obtain Non-Personal Information such as IP (internet protocol) addresses, browser types, the name of your ISP (internet service provider), information about where a user comes from before arriving at our Site, what pages a user visits, the order of those pages, and the amount of time spent on each. A vendor performs this service for us by sending a cookie to gather this information, compile it, and report to us. We use Non-Personal Information to customize the advertising and content you see, improve our services, conduct research, and provide anonymous aggregated reporting for internal audits and third-parties.<br>\n" +
    "<br>\n" +
    "Advertising Networks<br>\n" +
    "We may send to your web browser some of the advertisements you see when you use our network of web sites. However, we also allow other companies, called third-party ad servers or ad networks, to serve advertisements within our web pages. Because your web browser must request these advertising banners from the ad network web site, these companies can send their own cookies to your cookie file, just as if you had requested a web page from the web site. Please note that if an advertiser asks us to show an advertisement to a certain audience (for example, men ages 18-34) or audience segment (for example, men ages 18-24 who have viewed sports content) and you respond to that ad, the advertiser or ad-server may conclude that you fit the description of the audience they are trying to reach. As always, remember we authorize our third-party ad servers to employ anonymous cookies only for ad delivery and anonymous targeting. Our third-party ad servers do not collect, nor do we give them access, to any Personal Information about you.<br>\n" +
    "<br>\n" +
    "Opting Out of Third-Party Ad Servers<br>\n" +
    "If you want to prevent a third-party ad server from sending and reading cookies on your computer, currently you must visit each ad network's web site individually and opt out (if they offer this capability). <br>\n" +
    "<br>\n" +
    "3. Use of Information<br>\n" +
    "We use the Personal Information and the Non-Personal Information we collect on the Site (A) to provide you with the services that you purchased; (B) to receive, if you choose, to receive periodic Chefler Inc. updates; (C) to answer your through the Site, including saving searches and, if you request it, sending you updates about those searches questions or complaints; and (D) for analytical purposes to help us improve the Site and for our business generally.<br>\n" +
    "<br>\n" +
    "4. Sharing Your Information<br>\n" +
    "We do not rent, sell, or share with third parties the Personal Information we collect from you on this Site except (i) to provide information or services that you have requested, (ii) with your permission, or (iii) under the following circumstances:<br>\n" +
    "<br>\n" +
    "A. Third party vendors we engage to provide services on our behalf, such as payment processing, hosting, web-site development, and support, have access to Personal Information, but they have agreed not to disclose the Personal Information or to use it for any purpose other than providing the requested services.<br>\n" +
    "<br>\n" +
    "B. There may arise special circumstances where it is necessary for us to disclose and use Personal Information and Non-Personal Information, such as: to enforce this Privacy Statement or any other part of our Terms and Conditions to protect our property or rights; to protect the safety of anyone; to investigate, prevent, or take action regarding illegal or improper activities; to carry out a merger or consolidation with another entity, a sale or transfer of some or all of our assets, or any similar transaction; or for other reasons we determine in good faith are necessary, appropriate, or required by law, such as when we respond to subpoenas, court orders, or other legal or administrative process. In the event of a sale or transfer of assets, or similar transaction, Chefler Inc. will notify you before information about you is transferred and becomes subject to a different privacy policy.<br>\n" +
    "<br>\n" +
    "The Site contains links to third-party web sites, including our advertisers, or banner advertising.  When you click on those links, you will go to a third-party site where you will be subject to that site's privacy statement and we encourage you to read that policy statement. Please be aware that we are not responsible for the privacy practices of those other web sites and we expressly disclaim any liability for their actions, including actions relating to the use and disclosure of Personal Information by those third parties. We remind you to be aware of when you leave our Site and enter a third-party web site, and again encourage you to read the privacy statement on any web site that collects your Personal Information.<br>\n" +
    "<br>\n" +
    "5. Security<br>\n" +
    "Our hosting service maintains its systems in accordance with reasonable industry standards to reasonably secure the information of its customers. However, no data transmission over the Internet can be guaranteed to be 100% secure. \"Perfect security\" does not exist on the Internet, and you use the Site at your own risk.<br>\n" +
    "<br>\n" +
    "6. Correction/Updating Personal Information<br>\n" +
    "If your Personal Information changes or if you no longer wish to use the Site, you may correct or update your Personal Information or unsubscribe from any Chefler Inc. updates you have requested by modifying or deleting your profile on the Site, by writing to customer service at: help@chefler.com.  You retain all rights to your data.<br>\n" +
    "<br>\n" +
    "7. Children<br>\n" +
    "This Site is not directed to children under the age of 13 (\"Children\"), and we do not knowingly collect any information, including Personal Information, from Children.<br>\n" +
    "<br>\n" +
    "8. Comments and Questions<br>\n" +
    "If you have any questions or concerns about this Privacy Statement, please contact us by using the Contact Us feature or by postal mail at:<br>\n" +
    "Chefler Inc.<br>\n" +
    "Privacy Policy<br>\n" +
    "1400 Pine St #640653, San Francisco, CA 94164\n" +
    "</div>"
  );


  $templateCache.put('public/home/settings.html',
    "<div ng-controller=\"WrapperCtrl\">\n" +
    "\t<div class=\"alertContainer\">\n" +
    "\t\t<div ng-repeat=\"alert in alerts\" ng-class=\"{transparent: alert.dismissed}\" class=\"alertWrapper\" ng-show=\"!alert.hidden\">\n" +
    "\t\t\t<alert  type=\"alert.type\" close=\"closeAlert($index)\">{{alert.message}}</alert>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class='contentContainer' ng-controller='SettingsCtrl'>\n" +
    "\t\t<div class='settingsContainer'>\n" +
    "\t\t\t<div id='payments'>\n" +
    "\t\t\t\t<div class='header'>Payments</div>\n" +
    "\t\t\t\t<div class='lineItem amountDue'>\n" +
    "\t\t\t\t\t<div class='fieldName'>Amount due this Friday</div>\n" +
    "\t\t\t\t\t<div class='value'>{{(user.amountDue.amount_due/100 || 0) | currency}}</div>\n" +
    "\t\t\t\t\t<div class='actionContainer'><a tooltip-html-unsafe=\"{{viewBreakdown}}\" tooltip-placement='right' tooltip-popup-delay='100'>View Breakdown</a></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"divider\"></div>\n" +
    "\t\t\t<div id='delivery'>\n" +
    "\t\t\t\t<div class='header'>Delivery Preferences</div>\n" +
    "\t\t\t\t<div class='lineItem mealPlan'>\n" +
    "\t\t\t\t\t<div class='fieldName'>Meal plan</div>\n" +
    "\t\t\t\t\t<div class='value'>{{mealsPerWeek}}</div>\n" +
    "\t\t\t\t\t<div class='actionContainer'><a ng-click=\"editDeliveryDays()\">edit</a></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class='lineItem deliveryDays'>\n" +
    "\t\t\t\t\t<div class='fieldName'>Default delivery days</div>\n" +
    "\t\t\t\t\t<div class='value'>{{userDaysReadable}}</div>\n" +
    "\t\t\t\t\t<div class='actionContainer'><a ng-click=\"editDeliveryDays()\">edit</a></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class='lineItem deliveryTime'>\n" +
    "\t\t\t\t\t<div class='fieldName'>Default delivery time</div>\n" +
    "\t\t\t\t\t<div class='value'>{{readableTimeConversion[user.deliveryTime.dinner]}}</div>\n" +
    "\t\t\t\t\t<div class='actionContainer'><a ng-click=\"editDeliveryTime()\">edit</a></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class='lineItem address'>\n" +
    "\t\t\t\t\t<div class='fieldName'>Default address</div>\n" +
    "\t\t\t\t\t<div class='value'>{{user.address + ', ' + (user.address2 || '')}}<br>{{user.zip}}<br>{{user.instructions}}</div>\n" +
    "\t\t\t\t\t<div class='actionContainer'><a ng-click=\"editAddress()\">edit</a></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class='lineItem quantity'>\n" +
    "\t\t\t\t\t<div class='fieldName'>Default quantity</div>\n" +
    "\t\t\t\t\t<div class='value'>{{user.quantity}}</div>\n" +
    "\t\t\t\t\t<div class='actionContainer'><a ng-click=\"editQuantity()\">edit</a></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"divider\"></div>\n" +
    "\t\t\t<div id='account'>\n" +
    "\t\t\t\t<div class='header'>Account Settings</div>\n" +
    "\t\t\t\t<div class='lineItem name'>\n" +
    "\t\t\t\t\t<div class='fieldName'>Full name</div>\n" +
    "\t\t\t\t\t<div class='value'>{{user.name}}</div>\n" +
    "\t\t\t\t\t<div class='actionContainer'><a ng-click=\"editName()\">edit</a></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class='lineItem email'>\n" +
    "\t\t\t\t\t<div class='fieldName'>Email</div>\n" +
    "\t\t\t\t\t<div class='value'>{{user.email}}</div>\n" +
    "\t\t\t\t\t<div class='actionContainer'><a ng-click=\"editEmail()\">edit</a></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class='lineItem phone'>\n" +
    "\t\t\t\t\t<div class='fieldName'>Phone</div>\n" +
    "\t\t\t\t\t<div class='value'>{{user.phone}}</div>\n" +
    "\t\t\t\t\t<div class='actionContainer'><a ng-click=\"editPhone()\">edit</a></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class='lineItem password'>\n" +
    "\t\t\t\t\t<div class='fieldName'>Account password</div>\n" +
    "\t\t\t\t\t<div class='value'>*************</div>\n" +
    "\t\t\t\t\t<div class='actionContainer'><a ng-click=\"changePassword()\">edit</a></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class='lineItem payment'>\n" +
    "\t\t\t\t\t<div class='fieldName'>Payment info</div>\n" +
    "\t\t\t\t\t<div class='value'>Active</div>\n" +
    "\t\t\t\t\t<div class='actionContainer'><a ng-click=\"editPaymentInfo()\">edit</a></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class='lineItem other'>\n" +
    "\t\t\t\t\t<div class='fieldName'>Other actions</div>\n" +
    "\t\t\t\t\t<div class='actionContainer'><a ng-click=\"user.paused ? reactivateMealplan() : pauseMealplan()\">{{user.paused ? 'Reactivate Mealplan' : 'Pause Your Meal Plan'}}</a></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('public/home/termsOfService.html',
    "<a class=\"closeBtn\" ng-click=\"close()\">x</a>\n" +
    "<div class=\"termsModal\">\n" +
    "Chefler Inc. Terms & Conditions <br>\n" +
    "as of August 27, 2013<br>\n" +
    "<br>\n" +
    "WHAT YOU SHOULD KNOW<br>\n" +
    "Welcome to the Chefler Inc. web site (the \"Web Site\"). The goal of this Web Site is to provide you with chef prepared healthy meals that are warm, ready to eat and delivered to you and related links to meet your needs (the \"Content\"). Please read our Terms of Use (the \"Terms\") carefully before continuing on with your use of this Web Site. These Terms shall govern the use of the Web Site and apply to all Internet traffic visiting the Web Site. By accessing or using this Web Site, you agree to the Terms. The Terms are meant to protect all of our Web Site visitors and your use of this Web Site signifies your agreement with these Terms. IF YOU DO NOT AGREE WITH THESE TERMS, DO NOT USE THIS WEB SITE.<br>\n" +
    "<br>\n" +
    "Chefler Inc. (\"We\", \"Us\", \"Our\") reserves the right, in its sole discretion, to modify, alter or otherwise update these Terms at any time. Such modifications shall be effective immediately upon posting. By using this Web Site after we have posted notice of such modifications, alterations or updates you agree to be bound by such revised Terms. In accordance with our goals, this Web Site will permit you to link to many other web sites, that may or may not be affiliated with this Web Site and/or Chefler Inc., and that may have terms of use that differ from, or contain terms in addition to, the terms specified here. Your access to such web sites through links provided on this Web Site is governed by the terms of use and policies of those sites, not this Web Site.<br>\n" +
    "<br>\n" +
    "PRIVACY<br>\n" +
    "Registration data and certain other information about you is subject to our Privacy Policy. For more information, please review our full Privacy Policy.<br>\n" +
    "<br>\n" +
    "TRADEMARKS, COPYRIGHTS AND RESTRICTIONS<br>\n" +
    "This Web Site is controlled and operated by Chefler Inc., 1400 Pine St #640653, San Francisco, CA 94164, 415-275-0535. All content on this Web Site, including, but not limited to text, images, illustrations, audio clips, and video clips, is protected by copyrights, trademarks, service marks, and/or other intellectual property rights (which are governed by U.S. and worldwide copyright laws and treaty provisions, privacy and publicity laws, and communication regulations and statutes), and are owned and controlled by Chefler Inc. or its affiliates, or by third party content providers, merchants, sponsors and licensors (collectively \"Providers\") that have licensed their content or the right to market their products and/or services to Chefler Inc.. Content on this Web Site or any web site owned, operated, licensed or controlled by the Providers is solely for your personal, non-commercial use. You may print a copy of the Content and/or information contained herein for your personal, non-commercial use only, but you may not copy, reproduce, republish, upload, post, transmit, distribute, and/or exploit the Content or information in any way (including by e-mail or other electronic means) for commercial use without the prior written consent of Chefler Inc. or the Providers. You may request consent by emailing a request to the Chefler Inc. Legal Department at help@chefler.com. Without the prior written consent of Chefler Inc. or the Providers, your modification of the Content, use of the Content on any other web site or networked computer environment, or use of the Content for any purpose other than personal, non-commercial use, violates the rights of the owners of Chefler Inc. and/or the Provider copyrights, trademarks or service marks and other proprietary rights, and is prohibited. As a condition to your use of this Web Site, you warrant to Chefler Inc. that you will not use our Web Site for any purpose that is unlawful or prohibited by these Terms, including without limitation the posting or transmitting any threatening, libelous, defamatory, obscene, scandalous, inflammatory, pornographic, or profane material, nor in violation of the Acceptable Use Policy of the Web Site hosting service provider. If you violate any of these Terms, your permission to use our Web Site immediately terminates without the necessity of any notice. Chefler Inc. retains the right to deny access to anyone at its discretion for any reason, including for violation of these Terms. You may not use on your web site any trademarks, service marks or copyrighted materials appearing on this Web Site, including but not limited to any logos or characters, without the express written consent of the owner of the mark or copyright. You may not frame or otherwise incorporate into another web site any of the Content or other materials on this Web Site without prior written consent of Chefler Inc.<br>\n" +
    "<br>\n" +
    "DMCA Policy<br>\n" +
    "If you are notifying Chefler Inc. of alleged copyright infringement, please be sure to provide the following information in the form required by 17 USC Section 512:<br>\n" +
    "1.  A description of the copyrighted work that you allege is being infringed, or, if multiple copyrighted covered by a single notification, a representative list of such works;<br>\n" +
    "2.  A description of the allegedly infringing material and information sufficient to permit us to locate the material;<br>\n" +
    "3.  Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and/or an electronic mail address;<br>\n" +
    "4.  A statement by you that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, or its agent, or the law; and<br>\n" +
    "5.  A statement by you that the information in the notification is accurate and that you have the authority to enforce the copyrights that are claimed to be infringed.<br>\n" +
    "<br>\n" +
    "Designated Person for Notification of Claimed Copyright Infringement<br>\n" +
    "NAME: Omar Restom<br>\n" +
    "ADDRESS:  Chefler Inc<br>\n" +
    "1400 Pine St #640653, <br>\n" +
    "San Francisco, CA 94164\t<br>\n" +
    "EMAIL: help@chefler.com\t<br>\n" +
    "PHONE:  415-275-0535\t<br>\n" +
    "<br>\n" +
    "We may terminate the privileges of any user who uses the Sites unlawfully to transmit copyrighted material without a license, express consent, valid defense or fair use exemption to do so.<br>\n" +
    "<br>\n" +
    "PROHIBITED ACTIVITIES<br>\n" +
    "You are specifically prohibited from any use of this Web Site, and You agree not to use or permit others to use this Web Site, to: (a) take any action that imposes an unreasonable or disproportionately large load on the Web Site's infrastructure, including but not limited to \"spam\" or other such unsolicited mass e-mailing techniques; (b) disclose or share the assigned confirmation numbers and/or passwords with any unauthorized third parties or use the assigned confirmation numbers and/or passwords for any unauthorized purpose; (c) attempt to decipher, decompile, disassemble or reverse engineer any of the software or HTML code comprising or in any way making up a part of this Web Site; (d) upload, post, email or otherwise transmit any information, Content, or proprietary rights that You do not have a right to transmit under any law or under contractual or fiduciary relationships; (e) violate any applicable local, state, national or international law, including, but not limited to, any regulations having the force of law; or (f) use any robot, spider, intelligent agent, other automatic device, or manual process to search, monitor or copy our Web pages, or the Content without our prior written permission, provided that generally available third party Web browser such as Netscape Navigator and Microsoft Internet Explorer� may be used without such permission.<br>\n" +
    "<br>\n" +
    "LINKS<br>\n" +
    "This Web Site may contain links to other web sites (\"Linked Sites\"). The Linked Sites are provided for your convenience and information only and, as such, you access them at your own risk. The content of any Linked Sites is not under Chefler Inc.'s control, and  Chefler Inc. is not responsible for, and does not endorse, such content, whether or not Chefler Inc. is affiliated with the owners of such Linked Sites. You may not establish a hyperlink to this Web Site or provide any links that state or imply any sponsorship or endorsement of your web site by Chefler Inc., or its affiliates or Providers.<br>\n" +
    "<br>\n" +
    "DISCLAIMER OF WARRANTIES AND LIABILITY<br>\n" +
    "ALL CONTENT ON THIS WEB SITE IS PROVIDED \"AS IS\" AND WITHOUT WARRANTIES OF ANY KIND EITHER EXPRESS OR IMPLIED. OTHER THAN THOSE WARRANTIES WHICH, UNDER THE U.S. LAWS APPLICABLE TO THESE TERMS, ARE IMPLIED BY LAW AND ARE INCAPABLE OF EXCLUSION, RESTRICTION, OR MODIFICATION, Chefler Inc. DISCLAIMS ANY AND ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. NEITHER Chefler Inc., ITS AFFILIATED OR RELATED ENTITIES, NOR THE PROVIDERS, NOR ANY PERSON INVOLVED IN THE CREATION, PRODUCTION, AND DISTRIBUTION OF THIS WEB SITE WARRANT THAT THE FUNCTIONS CONTAINED IN THIS WEB SITE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVER THAT MAKES THE CONTENT AVAILABLE WILL BE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. THE CONTENT THAT YOU ACCESS ON THIS WEB SITE IS PROVIDED SOLELY FOR YOUR CONVENIENCE AND INFORMATION ONLY. Chefler Inc. DOES NOT WARRANT OR MAKE ANY REPRESENTATIONS REGARDING THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THIS WEB SITE, OR AS TO THE RELIABILITY, ACCURACY OR CURRENCY OF ANY INFORMATION CONTENT, SERVICE AND/OR MERCHANDISE ACQUIRED PURSUANT TO YOUR USE OF THIS WEB SITE. YOU EXPRESSLY AGREE THAT USE OF THIS WEB SITE IS AT YOUR SOLE RISK. YOU (AND NOT Chefler Inc.) ASSUME THE ENTIRE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION OF YOUR SYSTEM. YOU EXPRESSLY AGREE THAT NEITHER Chefler Inc., NOR ITS AFFILIATED OR RELATED ENTITIES (INCLUDING ITS PROVIDERS AND ITS WEB HOSTING SERVICE PROVIDERS, AND THEIR SUPPLIERS), NOR ANY OF THEIR RESPECTIVE EMPLOYEES, OR AGENTS, NOR ANY PERSON OR ENTITY INVOLVED IN THE CREATION, PRODUCTION, DISTRIBUTION, HOSTING, AND/OR OPERATION OF THIS WEB SITE, IS RESPONSIBLE OR LIABLE TO ANY PERSON OR ENTITY WHATSOEVER FOR ANY LOSS, DAMAGE (WHETHER ACTUAL, CONSEQUENTIAL, PUNITIVE OR OTHERWISE), INJURY, CLAIM, LIABILITY OR OTHER CAUSE OF ANY KIND OR CHARACTER WHATSOEVER BASED UPON OR RESULTING FROM THE USE OR ATTEMPTED USE OF THIS WEB SITE OR ANY OTHER LINKED SITE (INCLUDING, WITHOUT LIMITATION, USE OF OR ACCESS TO ANY RELATED SOFTWARE OR HARDWARE). BY WAY OF EXAMPLE, AND WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, Chefler Inc. AND RELATED PERSONS AND ENTITIES SHALL NOT BE RESPONSIBLE OR LIABLE FOR ANY CLAIM OR DAMAGE ARISING FROM FAILURE OF PERFORMANCE, ERROR, OMISSION, INTERRUPTION, DELETION, DEFECT, DELAY IN OPERATION, COMPUTER VIRUS, THEFT, DESTRUCTION, UNAUTHORIZED ACCESS TO OR ALTERATION OF PERSONAL RECORDS, OR THE RELIANCE UPON OR USE OF DATA, INFORMATION, OPINIONS OR OTHER MATERIALS APPEARING ON THIS WEB SITE. YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT Chefler Inc. IS NOT LIABLE OR RESPONSIBLE FOR ANY DEFAMATORY, OFFENSIVE OR ILLEGAL CONDUCT OF OTHER SUBSCRIBERS OR THIRD PARTIES. SOME JURISDICTIONS MAY NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES. IN SUCH JURISDICTIONS, Chefler Inc. LIABILITY IS LIMITED TO THE GREATEST EXTENT PERMITTED BY LAW.<br>\n" +
    "<br>\n" +
    "INDEMNIFICATION<br>\n" +
    "You agree to indemnify, defend, and hold harmless Chefler Inc., the Providers, and Web Site hosting service providers, and its and their officers, directors, employees, affiliates, agents, licensors, and suppliers from and against all losses, expenses, damages and costs, including reasonable attorneys' fees, resulting from any violation by you of these Terms, or the use of this website by you.<br>\n" +
    "<br>\n" +
    "THIRD PARTY RIGHTS<br>\n" +
    "These Terms are for the benefit of Chefler Inc., its Providers, and Web Site hosting service providers, and its and their officers, directors, employees, affiliates, agents, licensors, and suppliers. Each of these individuals or entities shall have the right to assert and enforce these Terms directly against you on its or their own behalf.<br>\n" +
    "<br>\n" +
    "DISPUTE RESOLUTION and JURISDICTION<br>\n" +
    "Unless otherwise specified, the Content contained in this Web Site is presented solely for your convenience and/or information. This Web Site is controlled and operated by Chefler Inc. from its offices within San Francisco, Ca. Chefler Inc. makes no representation that Content in its Web Site is appropriate or available for use in other locations. Those who choose to access this Web Site from other locations do so on their own initiative and are responsible for compliance with local laws, if and to the extent local laws are applicable. You may not use or export the materials in this Web Site in violation of U.S. export laws and regulations. These Terms shall be governed by, construed and enforced in accordance with the laws of the State of Delaware, as they are applied to agreements entered into and to be performed entirely within such State. As  the exclusive means of resolving through adversarial dispute resolution any disputes arising out of this agreement or the use of the Site, a party may demand that any such dispute be resolved by arbitration administered by the American Arbitration Association in accordance with its Commercial Arbitration Rules, and each party hereby consents to any such disputes being so resolved. Judgment on the award rendered in any such arbitration may be entered in any court having jurisdiction. Each party waives the right to bring a class action complaint or lawsuit. Any action concerning any dispute with respect to the Site must be commenced within one year after the cause of the dispute arises, or the cause of action is barred. If any provision of these Terms shall be unlawful, void or for any reason unenforceable, then that provision shall be deemed sever able from these Terms and shall not affect the validity and enforceability of any remaining provisions.<br>\n" +
    "<br>\n" +
    "ENTIRE AGREEMENT<br>\n" +
    "The provisions and conditions of these Terms, and each obligation referenced herein, represent the entire Agreement between Chefler Inc., its affiliated or related entities, and you, and supersede any prior agreements or understandings not incorporated herein.\n" +
    "</div>"
  );


  $templateCache.put('public/settings/changePasswordModal.html',
    "<a class=\"closeBtn\" ng-click=\"dismiss()\">×</a>\n" +
    "<h3>Change Password</h3>\n" +
    "<div class=\"form-group\">\n" +
    "\t<div class=\"passwordLabel\">New Password</div>\n" +
    "\t<input class=\"form-control\" type=\"password\" ng-model=\"user.password\" />\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "\t<div class=\"passwordLabel\">Confirm Password</div>\n" +
    "\t<input class=\"form-control\" type=\"password\" ng-model=\"user.passwordVerify\" ng-change=\"updateErrors()\" />\n" +
    "\t<alert class=\"errorText alert alert-danger\" id=\"confirmPasswordError\" ng-show=\"showErrors && errors.passwordVerify\">{{errors.passwordVerify}}</alert>\n" +
    "</div>\n" +
    "<a ng-click=\"dismiss()\" class=\"btn btn-inverse\" id='passwordModalCancel'>cancel</a>\n" +
    "<a ng-click=\"close()\" class=\"btn btn-warning\" id='passwordModalUpdate'>submit</a>"
  );


  $templateCache.put('public/settings/editAddressModal.html',
    "<a class=\"closeBtn\" ng-click=\"dismiss()\">×</a>\n" +
    "<h3>Edit Default Delivery Address</h3>\n" +
    "<div class=\"edit-address\" user=\"user\" continue=\"submit\" dismiss=\"cancel\"></div>"
  );


  $templateCache.put('public/settings/editDeliveryDaysModal.html',
    "<a class=\"closeBtn\" ng-click=\"dismiss()\">×</a>\n" +
    "<h3>How many dinners would you typically like delivered Mondays to Thursdays?</h3>\n" +
    "<div class=\"meals-per-week\" user=\"user\"></div>\n" +
    "<h3>On which default delivery days?</h3>\n" +
    "<div class=\"edit-delivery-days\" user=\"user\"></div>\n" +
    "<div class=\"buttonContainer\">\n" +
    "\t<a ng-click=\"dismiss()\" class=\"btn btn-inverse\" id='cancelEditDays'>cancel</a>\n" +
    "\t<a ng-click=\"close()\" class=\"btn btn-warning\" id='editDays'>submit</a>\n" +
    "</div>"
  );


  $templateCache.put('public/settings/editDeliveryTimeModal.html',
    "<a class=\"closeBtn\" ng-click=\"dismiss()\">×</a>\n" +
    "<h3>Edit Default Delivery Window</h3>\n" +
    "<div class=\"edit-delivery-time\" time=\"user.deliveryTime.dinner\"></div>\n" +
    "<a ng-click=\"dismiss()\" class=\"btn btn-inverse\" id='editDays'>cancel</a>\n" +
    "<a ng-click=\"close()\" class=\"btn btn-warning\" id='editDays'>submit</a>"
  );


  $templateCache.put('public/settings/editEmailModal.html',
    "<a class=\"closeBtn\" ng-click=\"dismiss()\">×</a>\n" +
    "<h3>Edit Email</h3>\n" +
    "<input class=\"form-control\" ng-model=\"user.email\" />\n" +
    "<div class=\"buttonContainer\">\n" +
    "\t<a ng-click=\"dismiss()\" class=\"btn btn-inverse\" id='emailModalCancel'>cancel</a>\n" +
    "\t<a ng-click=\"close()\" class=\"btn btn-warning\" id='emailModalUpdate'>submit</a>\n" +
    "</div>"
  );


  $templateCache.put('public/settings/editNameModal.html',
    "<a class=\"closeBtn\" ng-click=\"dismiss()\">×</a>\n" +
    "<h3>Edit Full Name</h3>\n" +
    "<input class=\"form-control\" ng-model=\"user.name\" />\n" +
    "<div class=\"buttonContainer\">\n" +
    "\t<a ng-click=\"dismiss()\" class=\"btn btn-inverse\" id='nameModalCancel'>cancel</a>\n" +
    "\t<a ng-click=\"close()\" class=\"btn btn-warning\" id='nameModalUpdate'>submit</a>\n" +
    "</div>"
  );


  $templateCache.put('public/settings/editPaymentInfoModal.html',
    "<a class=\"closeBtn\" ng-click=\"xButton()\">×</a>\n" +
    "<h3>Edit Payment Info</h3>\n" +
    "<div class=\"edit-payment-info\" dismiss=\"cancel\" continue=\"submit\"></div>"
  );


  $templateCache.put('public/settings/editPhoneModal.html',
    "<a class=\"closeBtn\" ng-click=\"dismiss()\">×</a>\n" +
    "<h3>Edit Phone</h3>\n" +
    "<input class=\"form-control\" ng-model=\"user.phone\" />\n" +
    "<div class=\"buttonContainer\">\n" +
    "\t<a ng-click=\"dismiss()\" class=\"btn btn-inverse\" id='phoneModalCancel'>cancel</a>\n" +
    "\t<a ng-click=\"close()\" class=\"btn btn-warning\" id='phoneModalUpdate'>submit</a>\n" +
    "</div>"
  );


  $templateCache.put('public/settings/editQtyModal.html',
    "<a class=\"closeBtn\" ng-click=\"dismiss()\">×</a>\n" +
    "<h3>Edit Default Quantity</h3>\n" +
    "<div class=\"subHeader\">How many meals would you like delivered on your default delivery days?</div>\n" +
    "<div class=\"edit-qty\" count=\"user.quantity\" min=1></div>\n" +
    "<div class=\"buttonContainer\">\n" +
    "\t<a ng-click=\"dismiss()\" class=\"btn btn-inverse\" id='qtyModalUpdate'>cancel</a>\n" +
    "\t<a ng-click=\"close()\" class=\"btn btn-warning\" id='qtyModalUpdate'>submit</a>\n" +
    "</div>"
  );


  $templateCache.put('public/settings/pauseMealplanModal.html',
    "<a class=\"closeBtn\" ng-click=\"dismiss()\">×</a>\n" +
    "<h3>We're sorry to see you go!</h3>\n" +
    "<div class=\"subHeader\">Please leave us some feedback so we can do better next time.</div>\n" +
    "<div class=\"cancelText\">If you want us to permanently delete your account, please email help@chefler.com</div>\n" +
    "<textarea class=\"reason\" rows=7 ng-model=\"user.cancelReason\" placeholder=\"Your feedback on why you would like to pause/cancel...\"></textarea>\n" +
    "<div class=\"buttonContainer\">\n" +
    "\t<a ng-click=\"dismiss()\" class=\"btn btn-inverse\" id='cancelPauseMealplan'>go back</a>\n" +
    "\t<a ng-click=\"close()\" class=\"btn btn-warning\" id='pauseMealplan'>pause mealplan</a>\n" +
    "</div>"
  );


  $templateCache.put('public/settings/reactivateMealplanModal.html',
    "<a class=\"closeBtn\" ng-click=\"dismiss()\">×</a>\n" +
    "<h3>Your meal plan is currently paused.<br> To reactivate, simply update below.</h3>\n" +
    "<div class=\"meals-per-week\" user=\"user\"></div>\n" +
    "<h3>On which default delivery days?</h3>\n" +
    "<div class=\"edit-delivery-days\" user=\"user\"></div>\n" +
    "<div class=\"buttonContainer\">\n" +
    "\t<a ng-click=\"dismiss()\" class=\"btn btn-inverse\" id='cancelReactivateMealplan'>cancel</a>\n" +
    "\t<a ng-click=\"close()\" class=\"btn btn-warning\" id='reactivateMealplan'>reactivate</a>\n" +
    "</div>"
  );

}]);
'use strict';

//Setting up route
window.app.config(['$urlRouterProvider', '$stateProvider', '$FBProvider', 'MomentProvider',

	function($urlRouterProvider, $stateProvider, $FBProvider, MomentProvider) {
		$FBProvider.setInitParams({
			appId: '202887703204611'
		});

		MomentProvider
			.asyncLoading(false)
			.scriptUrl('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.3.1/moment.min.js');

		$urlRouterProvider.otherwise('/');

		$stateProvider.state('adminIndex', {
			url: '/admin',
			templateUrl: 'admin/home.html'

		}).state('adminIndex.users', {
			url: '/users',
			templateUrl: 'admin/wrapper.html'
		}).state('adminIndex.users.list', {
			url: '/all',
			templateUrl: 'admin/users/list.html'
		}).state('adminIndex.users.create', {
			url: '/create',
			templateUrl: 'admin/users/createOrModify.html'
		}).state('adminIndex.users.modify', {
			url: '/:userId',
			templateUrl: 'admin/users/createOrModify.html'

		}).state('adminIndex.kitchens', {
			url: '/kitchens',
			templateUrl: 'admin/wrapper.html'
		}).state('adminIndex.kitchens.list', {
			url: '/all',
			templateUrl: 'admin/kitchens/list.html'
		}).state('adminIndex.kitchens.create', {
			url: '/create',
			templateUrl: 'admin/kitchens/createOrModify.html'
		}).state('adminIndex.kitchens.modify', {
			url: '/:kitchenId',
			templateUrl: 'admin/kitchens/createOrModify.html'

		}).state('adminIndex.calendars', {
			url: '/calendars',
			templateUrl: 'admin/wrapper.html'
		}).state('adminIndex.calendars.list', {
			url: '/all',
			templateUrl: 'admin/calendars/list.html'
		}).state('adminIndex.calendars.create', {
			url: '/create',
			templateUrl: 'admin/calendars/createOrModify.html'
		}).state('adminIndex.calendars.modify', {
			url: '/:calendarId',
			templateUrl: 'admin/calendars/createOrModify.html'

		}).state('adminIndex.coupons', {
			url: '/coupons',
			templateUrl: 'admin/wrapper.html'
		}).state('adminIndex.coupons.list', {
			url: '/all',
			templateUrl: 'admin/coupons/list.html'
		}).state('adminIndex.coupons.create', {
			url: '/create',
			templateUrl: 'admin/coupons/createOrModify.html'
		}).state('adminIndex.coupons.modify', {
			url: '/:couponId',
			templateUrl: 'admin/coupons/createOrModify.html'

		}).state('adminIndex.tags', {
			url: '/tags',
			templateUrl: 'admin/wrapper.html'
		}).state('adminIndex.tags.list', {
			url: '/all',
			templateUrl: 'admin/tags/list.html'
		}).state('adminIndex.tags.create', {
			url: '/create',
			templateUrl: 'admin/tags/createOrModify.html'
		}).state('adminIndex.tags.modify', {
			url: '/:tagId',
			templateUrl: 'admin/tags/createOrModify.html'

		}).state('adminIndex.ingredients', {
			url: '/ingredients',
			templateUrl: 'admin/wrapper.html'
		}).state('adminIndex.ingredients.list', {
			url: '/all',
			templateUrl: 'admin/ingredients/list.html'
		}).state('adminIndex.ingredients.create', {
			url: '/create',
			templateUrl: 'admin/ingredients/createOrModify.html'
		}).state('adminIndex.ingredients.modify', {
			url: '/:ingredientId',
			templateUrl: 'admin/ingredients/createOrModify.html'

		}).state('adminIndex.meals', {
			url: '/meals',
			templateUrl: 'admin/wrapper.html'
		}).state('adminIndex.meals.list', {
			url: '/all',
			templateUrl: 'admin/meals/list.html'
		}).state('adminIndex.meals.create', {
			url: '/create',
			templateUrl: 'admin/meals/createOrModify.html'
		}).state('adminIndex.meals.modify', {
			url: '/:mealId',
			templateUrl: 'admin/meals/createOrModify.html'

		}).state('adminIndex.orders', {
			url: '/orders',
			templateUrl: 'admin/wrapper.html'
		}).state('adminIndex.orders.search', {
			url: '/search',
			templateUrl: 'admin/orders/search.html'
		}).state('adminIndex.orders.list', {
			url: '/all',
			templateUrl: 'admin/orders/list.html'
		}).state('adminIndex.orders.create', {
			url: '/create',
			templateUrl: 'admin/orders/createOrModify.html'
		}).state('adminIndex.orders.kitchen', {
			url: '/kitchen',
			templateUrl: 'admin/orders/kitchenSearch.html'
		}).state('adminIndex.orders.user', {
			url: '/user',
			templateUrl: 'admin/orders/userSearch.html'
		}).state('adminIndex.orders.modify', {
			url: '/:orderId',
			templateUrl: 'admin/orders/createOrModify.html'

		});
	}
]);'use strict';

angular.module('mean.admin').controller('CreateOrModifyCalendarCtrl', ['$scope', 'Restangular', '$stateParams', '$location', 'Moment',
	function($scope, Restangular, $stateParams, $location, Moment) {
		// Initialize UI
		$scope.selectedDate = new Moment();
		$scope.dateString = new Moment($scope.selectedDate).format('YYYY-MM-DD');
		$scope.newMealType = 'dinner';
		$scope.mealFields = ['name', 'description', 'tags'];
		$scope.displayedMeals = {
			dinner: [],
			lunch: []
		};

		$scope.tableData = [{
				field: "_id",
				hide: true
			}, {
				label: "Name",
				field: "name"
			},
			/*{
			label: "Images",
			field: "images",
			displayFunction: function(tag) {
				// TODO: Implement this functionality
			}
		}, */
			{
				label: "Description",
				field: "description"
			}
			/*, {
				label: "Tags",
				field: "tags",
				displayFunction: function(tag) {
					// TODO: Implement this functionality
				}
			}*/
		];

		$scope.mealCallback = function(meals) {
			$scope.calendar.meals[$scope.dateString][$scope.newMealType] = meals;
			populateDisplayedMeals();
		}

		// Setup date key, calendar
		var calendar = Restangular.one('calendars', $stateParams.calendarId);

		// Init for existing calendars
		if ($stateParams.calendarId) {
			calendar.get().then(function(calendar) {
				$scope.calendar = calendar.data;

				if (!$scope.calendar.meals[$scope.dateString]) {
					$scope.calendar.meals[$scope.dateString] = {
						dinner: [],
						lunch: []
					};
				}

				if (!$scope.calendar.meals[$scope.dateString].dinner) {
					$scope.calendar.meals[$scope.dateString].dinner = [];
				}

				if (!$scope.calendar.meals[$scope.dateString].lunch) {
					$scope.calendar.meals[$scope.dateString].lunch = [];
				}

				$scope.displayedMeals = $scope.calendar.meals[$scope.dateString];
				populateDisplayedMeals();
			});
		} else {
			// Init for new calendar
			$scope.calendar = {
				meals: {}
			};

			$scope.calendar.meals[$scope.dateString] = {
				dinner: [],
				lunch: []
			};
		}

		$scope.removeMeal = function(meal, mealType) {
			var index = $scope.calendar.meals[$scope.dateString][mealType].indexOf(meal._id);

			$scope.displayedMeals[mealType].splice(index, 1);
			$scope.calendar.meals[$scope.dateString][mealType].splice(index, 1);
		};

		$scope.changePriority = function(meal, mealType, shiftAmount) {
			var meals = $scope.calendar.meals[$scope.dateString][mealType];
			var displayedMeals = $scope.displayedMeals[mealType];
			var index = meals.indexOf(meal);

			if (index + shiftAmount >= 0 && index + shiftAmount < meals.length) {
				// Shuffle calendar references to meals
				var temp = meals[index + shiftAmount];
				meals[index + shiftAmount] = meals[index];
				meals[index] = temp;

				// Shuffle displayed meals
				temp = displayedMeals[index + shiftAmount];
				displayedMeals[index + shiftAmount] = displayedMeals[index];
				displayedMeals[index] = temp;
			}
		};

		$scope.dateChanged = function(date) {
			$scope.selectedDate = new Moment(date);
			$scope.dateString = new Moment($scope.selectedDate).format('YYYY-MM-DD');
			if (!$scope.calendar.meals[$scope.dateString]) {
				$scope.calendar.meals[$scope.dateString] = {
					dinner: [],
					lunch: []
				};
			}

			if (!$scope.calendar.meals[$scope.dateString].dinner) {
				$scope.calendar.meals[$scope.dateString].dinner = [];
			}

			if (!$scope.calendar.meals[$scope.dateString].lunch) {
				$scope.calendar.meals[$scope.dateString].lunch = [];
			}

			populateDisplayedMeals();
		};

		var populateDisplayedMeals = function() {
			// This function encapsulates the index with the call so it can't
			// be modified by a continuing loop
			function closureWrapper(index, id, seating) {
				Restangular.one('meals', id).get().then(function(meal) {
					$scope.displayedMeals[seating][index] = meal.data;
				});
			}

			var meals = $scope.calendar.meals;
			$scope.displayedMeals = {};
			for (var seating in meals[$scope.dateString]) {
				$scope.displayedMeals[seating] = [];
				var seatingData = meals[$scope.dateString][seating];
				for (var mealId in seatingData) {
					closureWrapper(mealId, seatingData[mealId], seating);
				}
			}
		};

		$scope.submit = function() {
			if (!$stateParams.calendarId) {
				Restangular.all('calendars').post({
					calendarData: $scope.calendar
				}).then(requestComplete);
			} else {
				calendar.calendarData = $scope.calendar;
				calendar.put().then(requestComplete);
			}
		};

		function requestComplete(resp) {
			if (resp.status === 'success') {
				$location.path('/admin/calendars/all');
				$scope.$emit('alert', {
					type: 'success',
					message: 'Calendar saved successfully',
					survive: 1
				});
			} else if (resp.status === 'error') {
				for (var errorField in resp.data) {
					$scope.$emit('alert', {
						type: 'danger',
						message: resp.data[errorField]
					});
				}
			}
		}
	}
]);'use strict';

angular.module('mean.admin').controller('ListCalendarsCtrl', ['$scope', 'Restangular', '$location',
	function($scope, Restangular, $location) {

		Restangular.all('calendars').getList().then(function(calendars) {
			$scope.calendars = calendars.data;
		});

		$scope.predicate = 'created_at';

		$scope.view = function(calendar) {
			$location.path('/admin/calendars/' + (calendar ? calendar._id : 'create'));
		};
	}
]);'use strict';

angular.module('mean.admin').controller('CreateOrModifyCouponCtrl', ['$scope', 'Restangular', '$stateParams', '$location',
	function($scope, Restangular, $stateParams, $location) {
		var coupon = Restangular.one('coupons', $stateParams.couponId);

		if ($stateParams.couponId) {
			coupon.get().then(function(coupon) {
				$scope.coupon = coupon.data;
			});
		} else {
			$scope.coupon = {};
		}

		Restangular.all('coupons').one('stripeIds').get().then(function(resp) {
			$scope.stripeCoupons = resp.data;
		});

		$scope.setStripeId = function(coupon) {
			$scope.coupon.stripe_id = coupon.id;
		};

		$scope.submit = function() {
			if (!$stateParams.couponId) {
				Restangular.all('coupons').post({
					couponData: $scope.coupon
				}).then(requestComplete);
			} else {
				coupon.couponData = $scope.coupon;
				coupon.put().then(requestComplete);
			}
		};

		function requestComplete(resp) {
			if (resp.status === 'success') {
				$location.path('/admin/coupons/all');
				$scope.$emit('alert', {
					type: 'success',
					message: 'Coupon saved successfully',
					survive: 1
				});
			} else if (resp.status === 'error') {
				for (var errorField in resp.data) {
					$scope.$emit('alert', {
						type: 'danger',
						message: resp.data[errorField]
					});
				}
			}
		}
	}
]);'use strict';

angular.module('mean.admin').controller('ListCouponsCtrl', ['$scope', 'Restangular', '$location',
	function($scope, Restangular, $location) {

		Restangular.all('coupons').getList().then(function(coupons) {
			$scope.coupons = coupons.data;
		});

		$scope.predicate = 'created_at';

		$scope.view = function(coupon) {
			$location.path('/admin/coupons/' + (coupon ? coupon._id : 'create'));
		};
	}
]);'use strict';

angular.module('mean.system').controller('AdminIndexCtrl', ['$scope', 'Global', '$FB',
	function($scope, Global, $FB) {
		$scope.global = Global;

		$scope.fb = function() {
			$FB.login(function(resp) {
				location.href = '/auth/facebook';
			});
		};
	}
]);'use strict';

angular.module('mean.admin').controller('CreateOrModifyIngredientCtrl', ['$scope', 'Global', 'Restangular', '$stateParams', '$location', function ($scope, Global, Restangular, $stateParams, $location) {

	var ingredient = Restangular.one('ingredients', $stateParams.ingredientId);
	if ($stateParams.ingredientId) {
		ingredient.get().then(function(ingredient) {
			$scope.ingredient = ingredient.data;
		});
	} else {
		$scope.ingredient = {};
	}

	$scope.global = Global;
	$scope.addSupplier = function(supplier){
		$scope.ingredient.suppliers.push(supplier);
	};
	$scope.removeSupplier = function(supplier){
		var index = $scope.ingredient.suppliers.indexOf(supplier);
		if (index > -1) {
		    $scope.ingredient.suppliers.splice(index, 1);
		}
	};
	$scope.submit = function() {
		if (!$stateParams.ingredientId) {
			Restangular.all('ingredients').post({
				data: $scope.ingredient
			}).then(requestComplete);
		} else {
			ingredient.data = $scope.ingredient;
			ingredient.put().then(requestComplete);
		}
	};

	function requestComplete(resp) {
		if (resp.status === 'success') {
			$location.path('/admin/ingredients/all');
			$scope.$emit('alert', {
				type: 'success',
				message: 'Ingredient saved successfully',
				survive: 1
			});
		} else if (resp.status === 'error') {
			for (var errorField in resp.data) {
				$scope.$emit('alert', {
					type: 'danger',
					message: resp.data[errorField]
				});
			}
		}
	}
}]);'use strict';

angular.module('mean.admin').controller('ListIngredientsCtrl', ['$scope', 'Global', 'Restangular', '$location',
	function($scope, Global, Restangular, $location) {


		Restangular.all('ingredients').getList().then(function(ingredients) {

			$scope.ingredients = ingredients.data;
		});

		$scope.predicate = 'created_at';

		$scope.global = Global;

		$scope.view = function(ingredient) {
			$location.path('/admin/ingredients/' + (ingredient ? ingredient._id : 'create'));
		};
	}
]);'use strict';

angular.module('mean.admin').controller('CreateOrModifyKitchenCtrl', ['$scope', 'Restangular', '$stateParams', '$location',
	function($scope, Restangular, $stateParams, $location) {
		var kitchen = Restangular.one('kitchens', $stateParams.kitchenId);

		if ($stateParams.kitchenId) {
			kitchen.get().then(function(kitchen) {
				$scope.kitchen = kitchen.data;
				if (!$scope.kitchen.cronJobs) {
					$scope.kitchen.cronJobs = {};
				}
			});
		} else {
			$scope.kitchen = {
				cronJobs: {

				}
			};
		}
		$scope.tableData = [{
			field: "_id",
			hide: true
		}, {
			label: "Name",
			field: "name"
		}];

		$scope.calendarCallback = function(calendarArray) {
			$scope.kitchen.calendar = calendarArray[0];
		}

		$scope.addZip = function(zip) {
			$scope.kitchen.zips_served.push(zip);
		};

		$scope.submit = function() {
			if (!$stateParams.kitchenId) {
				Restangular.all('kitchens').post({
					kitchenData: $scope.kitchen
				}).then(requestComplete);
			} else {
				kitchen.kitchenData = $scope.kitchen;
				kitchen.put().then(requestComplete);
			}
		};

		function requestComplete(resp) {
			if (resp.status === 'success') {
				$location.path('/admin/kitchens/all');
				$scope.$emit('alert', {
					type: 'success',
					message: 'Kitchen saved successfully',
					survive: 1
				});
			} else if (resp.status === 'error') {
				for (var errorField in resp.data) {
					$scope.$emit('alert', {
						type: 'danger',
						message: resp.data[errorField]
					});
				}
			}
		}
	}
]);'use strict';

angular.module('mean.admin').controller('ListKitchensCtrl', ['$scope', 'Restangular', '$location',
	function($scope, Restangular, $location) {

		Restangular.all('kitchens').getList().then(function(kitchens) {
			$scope.kitchens = kitchens.data;
		});

		$scope.predicate = 'created_at';

		$scope.view = function(kitchen) {
			$location.path('/admin/kitchens/' + (kitchen ? kitchen._id : 'create'));
		};
	}
]);'use strict';

angular.module('mean.admin').controller('CreateOrModifyMealCtrl', ['$scope', 'Restangular', '$stateParams', '$location',
	function($scope, Restangular, $stateParams, $location) {

		var meal = Restangular.one('meals', $stateParams.mealId);

		$scope.ingredientFields = ['name', 'nut', 'gluten'];

		if ($stateParams.mealId) {
			meal.get().then(function(meal) {
				$scope.meal = meal.data;
			});
		} else {
			$scope.meal = {
				ingredients: [],
				tags: [],
				images: []
			};
		}

		$scope.clearRelations = function(type) {
			$scope.meal[type] = [];
		};

		$scope.tableData = [{
			field: "_id",
			hide: true
		}, {
			label: "Name",
			field: "name"
		}, {
			label: "Priority",
			field: "priority"
		}];

		$scope.types = [
			'entree',
			'lunch',
			'starter',
			'side',
			'desert'
		];

		$scope.tagCallback = function(tags) {
			$scope.meal.tags = tags;
		}

		$scope.setType = function(type) {
			$scope.meal.type = type;
		};

		$scope.submit = function() {
			// check for ingredients
			if (!$stateParams.mealId) {
				Restangular.all('meals').post({
					data: $scope.meal
				}).then(requestComplete);
			} else {
				meal.data = $scope.meal;
				meal.put().then(requestComplete);
			}
		};

		function requestComplete(resp) {
			if (resp.status === 'success') {
				$location.path('/admin/meals/all');
				$scope.$emit('alert', {
					type: 'success',
					message: 'Meal saved successfully',
					survive: 1
				});
			} else if (resp.status === 'error') {
				for (var errorField in resp.data) {
					$scope.$emit('alert', {
						type: 'danger',
						message: resp.data[errorField]
					});
				}
			}
		}
	}
]);'use strict';

angular.module('mean.admin').controller('ListMealsCtrl', ['$scope', 'Global', 'Restangular', '$location',
	function($scope, Global, Restangular, $location) {
		Restangular.all('meals').getList().then(function(meals) {
			$scope.meals = meals.data;
		});

		$scope.predicate = 'created_at';

		$scope.global = Global;

		$scope.view = function(meal) {
			$location.path('/admin/meals/' + (meal ? meal._id : 'create'));
		};
	}
]);'use strict';

angular.module('mean.admin').controller('CreateOrModifyOrderCtrl', ['$scope', 'Global', 'Restangular', '$stateParams', '$location', '$modal', 'Moment',
	function($scope, Global, Restangular, $stateParams, $location, $modal, Moment) {

		var order = Restangular.one('orders', $stateParams.orderId);
		if ($stateParams.orderId) {
			order.get().then(function(order) {
				$scope.order = order.data;
			});
		} else {
			$scope.order = {};

		}
		$scope.selectedDate = Moment();
		$scope.dateChanged = function(date) {
			$scope.selectedDate = new Moment(date);
			var dateString = new Moment($scope.selectedDate).format('YYYY-MM-DD');

		};
		$scope.global = Global;


		$scope.submit = function() {
			// check for ingredients
			if (!$stateParams.orderId) {
				Restangular.all('orders').post({
					data: $scope.order
				}).then(requestComplete);
			} else {
				order.data = $scope.order;
				order.put().then(requestComplete);
			}
		};

		function requestComplete(resp) {
			if (resp.status === 'success') {
				$location.path('/admin/orders/search');
				$scope.$emit('alert', {
					type: 'success',
					message: 'Order saved successfully',
					survive: 1
				});
			} else if (resp.status === 'error') {
				for (var errorField in resp.data) {
					$scope.$emit('alert', {
						type: 'danger',
						message: resp.data[errorField]
					});
				}
			}
		}
	}
]);'use strict';

angular.module('mean.admin').controller('SearchKitchenOrders', ['$scope', 'Restangular', '$stateParams', '$location', 'Moment',
	function($scope, Restangular, $stateParams, $location, Moment) {
		$scope.params = {
			type: 'kitchen'
		};

		$scope.displayTableData = [{
			label: 'User',
			field: 'userName'
		}, {
			label: 'Date',
			field: 'date',
			formatFunction: 'date'
		}, {
			label: 'Meal name',
			field: 'mealName'
		}, {
			label: 'Time',
			field: 'time'
		}];

		$scope.modalTableData = [{
			field: "_id",
			hide: true
		}, {
			label: "Name",
			field: "name"
		}, {
			label: "Email",
			field: "email"
		}, {
			label: "Phone",
			field: "phone"
		}];

		$scope.submit = function() {
			Restangular.one('orders').getList('search', $scope.params).then(function(orders) {
				console.log(orders);
				$scope.orders = orders.data;
				console.log($scope.orders);
			}, function(err) {
				if (err.data) {
					$scope.$emit('alert', {
						type: 'danger',
						message: err.data.message
					});
				};
			});
		};

		$scope.startDateChanged = function(date) {
			$scope.params.start = Moment(date).format('YYYY-MM-DD');
			$scope.params.end = Moment(date).format('YYYY-MM-DD');
		};
		$scope.download = function() {
			function toQueryString(obj) {
				var parts = [];
				for (var i in obj) {
					if (obj.hasOwnProperty(i)) {
						parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
					}
				}
				return parts.join("&");
			}
			params = $scope.params;
			params.download = true;
			var win = window.open(window.location.origin + '/orders/search/?' + toQueryString(params), '_blank');
			win.focus();
		};
		$scope.kitchenCallback = function(kitchen) {
			$scope.params.kitchen = kitchen[0];
		};
	}
]);// 'use strict';

// angular.module('mean.admin').controller('ListOrdersCtrl', ['$scope', 'Global', 'Restangular', '$location',
// 	function($scope, Global, Restangular, $location) {

// 		Restangular.all('orders').getList().then(function(orders) {
// 			$scope.orders = orders.data;
// 		});

// 		$scope.predicate = 'created_at';

// 		$scope.global = Global;

// 		$scope.view = function(order) {
// 			$location.path('/admin/orders/' + (order ? order._id : 'create'));
// 		};
// 	}
// ]);'use strict';

angular.module('mean.admin').controller('SearchOrdersCtrl', ['$scope', 'Global', '$location',
	function($scope, Global, $location) {

		$scope.predicate = 'created_at';

		$scope.global = Global;
		$scope.kitchen = function() {
			$location.path('/admin/orders/kitchen');
		};
		$scope.user = function(order) {
			$location.path('/admin/orders/user');
		};
		$scope.view = function(order) {
			$location.path('/admin/orders/' + (order ? order._id : 'create'));
		};
	}
]);'use strict';

angular.module('mean.admin').controller('SearchUserOrders', ['$scope', 'Restangular', '$stateParams', '$location', 'Moment',
	function($scope, Restangular, $stateParams, $location, Moment) {

		$scope.params = {
			type: 'user'
		};

		$scope.displayTableData = [{
			label: 'User',
			field: 'user',
			subfield: 'name'
		}, {
			label: 'Date',
			field: 'date',
			formatFunction: 'date'
		}, {
			label: 'Meal name',
			field: 'meal',
			subfield: 'name'
		}, {
			label: 'Time',
			field: 'time'
		}];

		$scope.modalTableData = [{
			field: "_id",
			hide: true
		}, {
			label: "Name",
			field: "name"
		}, {
			label: "Email",
			field: "email"
		}, {
			label: "Phone",
			field: "phone"
		}];

		$scope.submit = function() {
			console.log($scope.params);
			Restangular.one('orders').getList('search', $scope.params).then(function(orders) {
				$scope.orders = orders.data;
			}, function(err) {
				if (err.data) {
					$scope.$emit('alert', {
						type: 'danger',
						message: err.data.message
					});
				};
			});
		};

		$scope.startDateChanged = function(date) {
			$scope.params.start = new Moment(date).format('YYYY-MM-DD');
		};

		$scope.endDateChanged = function(date) {
			$scope.params.end = new Moment(date).format('YYYY-MM-DD');
		};

		$scope.userCallback = function(user) {
			$scope.params.user = user[0];
		}
	}
]);'use strict';

angular.module('mean.admin').controller('CreateOrModifyReviewCtrl', ['$scope', 'Global', 'Reviews', '$stateParams', '$location',
	function($scope, Global, Reviews, $stateParams, $location) {

		if ($stateParams.ingredientId) {
			Reviews.review.get({
				reviewId: $stateParams.reviewId
			}, function(ingredients) {
				$scope.ingredient = ingredients.data;
			});
		} else {
			$scope.ingredient = {};
		}

		$scope.global = Global;
		$scope.addSupplier = function(supplier) {
			$scope.ingredient.suppliers.push(supplier);
		};
		$scope.removeSupplier = function(supplier) {
			var index = $scope.ingredient.suppliers.indexOf(supplier);
			if (index > -1) {
				$scope.ingredient.suppliers.splice(index, 1);
			}
		};
		$scope.submit = function() {
			if (!$stateParams.ingredientId) {
				Reviews.review.save({
					data: $scope.ingredient
				}, function(resp) {
					if (resp.status === 'success') {
						$location.path('/admin/ingredients');
					} else if (resp.status === 'error') {
						$scope.$emit('alert', {
							type: 'Danger',
							message: 'Set this value once the dependency stuff is settled'
						});
					}
				});
			} else {
				Reviews.review.update({
					data: $scope.ingredient
				}, function(resp) {
					if (resp.status === 'success') {
						$location.path('/admin/ingredients/all');
						$scope.$emit('alert', {
							type: 'success',
							message: 'Ingredient successfully updated.',
							survive: 1
						});
					} else if (resp.status === 'error') {
						$scope.$emit('alert', {
							type: 'Danger',
							message: 'Set this value once the dependency stuff is settled'
						});
					}
				});
			}
		};
	}
]);'use strict';

// angular.module('mean.admin').controller('ListIngredientsCtrl', ['$scope', 'Global', 'Ingredients', '$location', function ($scope, Global, Ingredients, $location) {

// 	Ingredients.ingredient.all(function (ingredients) {
// 		$scope.ingredients = ingredients.data;
// 	});

// 	$scope.predicate = 'created_at';

// 	$scope.global = Global;

// 	$scope.view = function (ingredient) {
// 		$location.path('/admin/ingredients/' + (ingredient ? ingredient._id : 'create'));
// 	};
// }]);'use strict';

angular.module('mean.admin').controller('CreateOrModifyTagCtrl', ['$scope', 'Restangular', '$stateParams', '$location',
	function($scope, Restangular, $stateParams, $location) {
		var tag = Restangular.one('tags', $stateParams.tagId);

		if ($stateParams.tagId) {
			tag.get().then(function(tag) {
				$scope.tag = tag.data;
			});
		} else {
			$scope.tag = {};
		}


		$scope.setPriority = function(priority) {
			$scope.tag.priority = priority;
		};

		$scope.submit = function() {
			if (!$stateParams.tagId) {
				Restangular.all('tags').post({
					data: $scope.tag
				}).then(requestComplete);
			} else {
				tag.data = $scope.tag;
				tag.put().then(requestComplete);
			}
		};

		function requestComplete(resp) {
			if (resp.status === 'success') {
				$location.path('/admin/tags/all');
				$scope.$emit('alert', {
					type: 'success',
					message: 'Tag successfully updated.',
					survive: 1
				});
			} else if (resp.status === 'error') {
				for (var errorField in resp.data) {
					$scope.$emit('alert', {
						type: 'danger',
						message: resp.data[errorField]
					});
				}
			}
		}
	}
]);
'use strict';

angular.module('mean.admin').controller('ListTagsCtrl', ['$scope', 'Global', 'Restangular', '$location',
	function($scope, Global, Restangular, $location) {

		Restangular.all('tags').getList().then(function(tags) {
			$scope.tags = tags.data;
		});

		$scope.predicate = 'created_at';

		$scope.global = Global;

		$scope.view = function(tag) {
			$location.path('/admin/tags/' + (tag ? tag._id : 'create'));
		};
	}
]);'use strict';

angular.module('mean.admin').controller('CreateOrModifyUserCtrl', ['$scope', '$stateParams', '$location', 'Restangular',
	function($scope, $stateParams, $location, Restangular) {
		var user = Restangular.one('users', $stateParams.userId);

		$scope.selectedTags = [];

		if ($stateParams.userId) {
			user.get().then(function(user) {
				$scope.user = user.data;

				if ($scope.user.tags) {
					for (var i = 0; i < $scope.user.tags.length; i++) {
						$scope.selectedTags.push($scope.user.tags[i]._id);
					}
				}
			});
		} else {
			// Default to empty object for new user
			$scope.user = {};
		}

		$scope.tableData = [{
			field: "_id",
			hide: true
		}, {
			label: "Name",
			field: "name"
		}, {
			label: "Priority",
			field: "priority"
		}];

		$scope.tagCallback = function(tags) {
			$scope.user.tags = tags;
		};

		$scope.submit = function() {
			_.forEach($scope.user.delivery_preferences, function(meals, day) {
				if (meals.dinner) {
					meals.dinner.time = $scope.user.deliveryTime.dinner;
				}
			});

			if (!$stateParams.userId) {
				Restangular.all('users').post({
					userData: $scope.user
				}).then(requestComplete);
			} else {
				user.userData = $scope.user;
				user.put().then(requestComplete);
			}
		};

		$scope.delete = function() {
			var confirm = window.confirm("Are you sure you want to delete " + $scope.user.name + "? This can not be undone.");

			if (confirm) {
				user.remove().then(function(resp) {
					if (resp.status === 'success') {
						$location.path('/admin/users/all');
						$scope.$emit('alert', {
							type: 'success',
							message: 'User deleted successfully',
							survive: 1
						});
					} else if (resp.status === 'error') {
						for (var errorField in resp.data) {
							$scope.$emit('alert', {
								type: 'danger',
								message: resp.data[errorField]
							});
						}
					}
				});
			}
		};

		function requestComplete(resp) {
			if (resp.status === 'success') {
				$location.path('/admin/users/all');
				$scope.$emit('alert', {
					type: 'success',
					message: 'User saved successfully',
					survive: 1
				});
			} else if (resp.status === 'error') {
				for (var errorField in resp.data) {
					$scope.$emit('alert', {
						type: 'danger',
						message: resp.data[errorField]
					});
				}
			}
		}
	}
]);'use strict';

angular.module('mean.admin').controller('ListUsersCtrl', ['$scope', 'Global', '$location', 'Restangular',
	function($scope, Global, $location, Restangular) {

		Restangular.all('users').getList().then(function(users) {
			$scope.users = users.data;
		});

		$scope.predicate = 'created_at';

		$scope.global = Global;

		$scope.view = function(user) {
			$location.path('/admin/users/' + (user ? user._id : 'create'));
		};

		$scope.togglePause = function(user) {
			var user = Restangular.one('users', user._id);

			user.get().then(function(fetchedUser) {
				fetchedUser.paused = !fetchedUser.paused;

				user.userData = fetchedUser;
				user.put().then(function(resp) {
					console.log(resp);
				});
			});
		};
	}
]);'use strict';

angular.module('mean.admin').controller('ListModal', ['$scope', 'Restangular', '$modal',
	function($scope, Restangular, $modal) {
		var closeCallback,
			selectedModels = [];

		$scope.open = function(modelName, columnData, existingModels, callback) {
			if (_.isArray(existingModels)) {
				selectedModels = existingModels;
			} else if (existingModels) {
				selectedModels = [existingModels]
			}

			closeCallback = callback;

			Restangular.all(modelName).getList().then(function(collection) {
				$scope.rows = collection.data;
				$scope.columns = columnData;

				$scope.modal = $modal.open({
					templateUrl: 'admin/common/table.html',
					controller: function($scope) {
						$scope.select = function(model) {
							var index = _.indexOf(selectedModels, model._id);

							if (index == -1) {
								selectedModels.push(model._id);
							} else {
								selectedModels.splice(index, 1);
							}
						};

						$scope.rowClass = function(row) {
							return _.indexOf(selectedModels, row._id) != -1 ? 'selected' : undefined;
						};
					},
					scope: $scope
				});

				// Resolves when the modal is closed or dismissed (background has been clicked)
				$scope.modal.result.then($scope.modalClosed, $scope.modalClosed);
			});
		};

		$scope.ok = function() {
			$scope.modal.close();
		}

		$scope.modalClosed = function() {
			closeCallback(selectedModels);
		};
	}
]);'use strict';
app.directive('progressBar', function() {
	return {
		restrict: 'EA',
		require: 'upload',
		template: '<div  ng-show="upload.active" class="progress progress-striped"><div class="progress-bar progress-bar-info" role="progressbar" style="width:{{upload.progress}}%;">{{upload.message}}</div></div>',

	}
});'use strict';
app.directive('upload', ['Restangular',
	function(Restangular) {
		return {
			restrict: 'EA',
			template: '<input type="file"></input><progress-bar ng-model="upload"></progress-bar>',
			controller: function($scope) {
				$scope.upload = {
					active: false,
					progress: 0
				};
				$scope.setup = function() {
					$scope.upload.active = true;

					var uploadoptions = {
						type: "POST",
						path: encodeURI("/images/" + $scope.file.name),
						datatype: "binary/octel-stream",
						bucket: "chefler",
						endings: "?uploads"
					};
					Restangular.one('certificate').get(uploadoptions).then(function(cert) {
						// here we can start the upload
						var request = new XMLHttpRequest();
						request.withCredentials = true;
						request.open("POST", "http://" + uploadoptions.bucket + ".s3-us-west-2.amazonaws.com" + uploadoptions.path + "?uploads", true);
						request.setRequestHeader("Authorization", "AWS " + cert.data.s3Key + ":" + cert.data.s3Signature + "");
						request.setRequestHeader("X-Amz-Date", cert.data.s3Policy.expires);
						request.setRequestHeader("Content-Type", "binary/octel-stream");
						request.onload = $scope.response;
						request.send();
					}, function(err) {

					});
				};
				$scope.response = function() {
					$scope.upload.id = encodeURI(this.responseXML.getElementsByTagName("UploadId")[0].childNodes[0].nodeValue);
					$scope.upload.path = encodeURI(this.responseXML.getElementsByTagName("Key")[0].childNodes[0].nodeValue);
					$scope.startUpload();
				};
				$scope.startUpload = function() {
					$scope.upload.BYTES_PER_CHUNK = 1024 * 1024 * 5; // 5MB chunk sizes.
					$scope.upload.SIZE = $scope.file.size;
					$scope.upload.nochunks = Math.round($scope.file.size / $scope.upload.BYTES_PER_CHUNK);
					$scope.upload.startpoint = 0;
					$scope.upload.end = $scope.upload.BYTES_PER_CHUNK;
					$scope.upload.index = 1;
					while ($scope.upload.startpoint < $scope.upload.SIZE) {
						if ($scope.upload.end > $scope.upload.SIZE) {
							$scope.upload.end = $scope.upload.SIZE;
						};
						$scope.eachchunk({
							"blob": $scope.slice($scope.upload.startpoint, $scope.upload.end),
							"index": $scope.upload.index,
							"parentid": $scope.upload.id,
							"size": $scope.upload.BYTES_PER_CHUNK

						});

						$scope.upload.startpoint = $scope.upload.end;
						$scope.upload.end = $scope.upload.startpoint + $scope.upload.BYTES_PER_CHUNK;
						$scope.upload.index = $scope.upload.index + 1;

					}
				};
				$scope.eachchunk = function(blob) {
					var options = {
						type: "PUT",
						path: "/" + $scope.upload.path,
						bucket: "chefler",
						endings: encodeURI("?partNumber=" + blob.index + "&uploadId=" + $scope.upload.id.replace(/\s/g, ''))
					};
					Restangular.one('certificate').get(options).then(function(cert) {
						var progressFunction = function(e) {

							this.uprogress = e.loaded;
							$scope.upload.progress = $scope.progress();
							$scope.upload.message = '' + $scope.progress() + '%';
							$scope.$apply();
						};
						//closure to return in xhr request in desired scope.
						var bindxmlhttp = function(xhr) {
							return function(e) {
								progressFunction.call(xhr, e);
							};
						};
						$scope.chunks[blob.index - 1] = new XMLHttpRequest();
						$scope.chunks[blob.index - 1].blob = blob;
						$scope.chunks[blob.index - 1].uprogress = 0;
						$scope.chunks[blob.index - 1].withCredentials = true;
						$scope.chunks[blob.index - 1].open("PUT", "http://" + options.bucket + ".s3-us-west-2.amazonaws.com" + options.path + options.endings, true);
						$scope.chunks[blob.index - 1].setRequestHeader("Authorization", "AWS " + cert.data.s3Key + ":" + cert.data.s3Signature);
						$scope.chunks[blob.index - 1].setRequestHeader("X-Amz-Date", cert.data.s3Policy.expires);
						//remember to a add expose header

						$scope.chunks[blob.index - 1].upload.addEventListener("progress", bindxmlhttp($scope.chunks[blob.index - 1]), false);
						$scope.chunks[blob.index - 1].onload = function() {

							//console.log(this.responseXML.getElementsByTagName("ETag")[0].childNodes[0].nodeValue);
							$scope.chunks[blob.index - 1].etag = this.getResponseHeader("ETag").toString();
							$scope.etag++;
							if ($scope.etag == $scope.chunks.length) {
								$scope.complete();
							};


						};
						$scope.chunks[blob.index - 1].send(blob.blob);
					}, function(err) {

					});


				};
				$scope.etag = 0;
				$scope.chunks = [];
				$scope.progress = function() {

					var total = 0;
					for (var i = 0; i < $scope.chunks.length; i++) {
						total = total + $scope.chunks[i].uprogress;
					};
					return ((total / $scope.upload.SIZE) * 100) || 0;
				};

				$scope.complete = function() {

					var uploadoptions = {
						type: "POST",
						path: "/" + $scope.upload.path,
						datatype: "application/xml",
						bucket: "chefler",
						endings: "?uploadId=" + $scope.upload.id
					};
					Restangular.one('certificate').get(uploadoptions).then(function(cert) {
						var xml = "<CompleteMultipartUpload>";
						for (var i = 0; i < $scope.chunks.length; i++) {

							xml = xml + "<Part>";
							xml = xml + "<PartNumber>" + $scope.chunks[i].blob.index + "</PartNumber>";
							xml = xml + "<ETag>" + $scope.chunks[i].etag + "</ETag>";

							xml = xml + "</Part>";


						};
						xml = xml + "</CompleteMultipartUpload>";
						var complete = new XMLHttpRequest();
						complete.open("POST", "http://" + uploadoptions.bucket + ".s3-us-west-2.amazonaws.com" + [uploadoptions.path] + "" + [uploadoptions.endings] + "", true);
						complete.setRequestHeader("Authorization", "AWS " + cert.data.s3Key + ":" + cert.data.s3Signature + "");
						complete.setRequestHeader("X-Amz-Date", cert.data.s3Policy.expires);
						complete.setRequestHeader("Content-Type", "application/xml");
						complete.onload = function() {
							if (Math.round($scope.progress()) == 100) {

								$scope.upload.message = "Upload Complete!";
								$scope.upload.complete = true;
								$scope.upload.url = 'https://chefler.s3-us-west-2.amazonaws.com/' + $scope.upload.path + '';
								$scope.meal.images[0] = $scope.upload.url;
								$scope.upload.active = false;
								$scope.$apply();
							};
						};
						complete.send($scope.StringtoXML(xml));
					});

				};

				$scope.slice = function(start, end) {

					for (var prop in $scope.file) {
						if (!$scope.file.hasOwnProperty(prop) && prop.indexOf("lice") > -1) {

							return $scope.file[prop](start, end);

						} else {

						}
					}
				}
				$scope.StringtoXML = function(text) {
					if (window.ActiveXObject) {
						var doc = new ActiveXObject('Microsoft.XMLDOM');
						doc.async = 'false';
						doc.loadXML(text);
					} else {
						var parser = new DOMParser();
						var doc = parser.parseFromString(text, 'text/xml');
					}
					return doc;
				};
			},
			link: function($scope, el) {
				el.bind("change", function(e) {
					$scope.file = (e.srcElement || e.target).files[0];
					$scope.setup();
				});
			}
		}
	}
]);'use strict';

angular.module('mean.admin').controller('WrapperCtrl', ['$scope', '$timeout',
	function($scope, $timeout) {
		$scope.alerts = [];
		$scope.$on('alert', function(event, data) {
			addAlert(data.type, data.message, data.survive, data.timeout);
		});

		$scope.$on('$stateChangeSuccess', function() {
			if ($scope.alerts) {
				for (var i = 0; i < $scope.alerts.length; i++) {
					if ($scope.alerts[i].survive > 0) {
						$scope.alerts[i].survive--;
					} else {
						$scope.alerts[i] = undefined;
					}
				}

				// Removes undefined items
				$scope.alerts = $scope.alerts.filter(function(alert) {
					return alert;
				});
			}
		});

		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};

		function addAlert(type, message, survive, timeout) {
			var alertData = {
				type: type,
				message: message,
				survive: survive
			};

			if (timeout) {
				$timeout(function() {
					alertData.dismissed = true;
					$timeout(function() {
						alertData.hidden = true;
					}, 1000);
				}, timeout);
			}

			$scope.alerts.push(alertData);
		}
	}
]);'use strict';

angular.module('mean.system').controller('HeaderCtrl', ['$scope', 'Global', '$state',
	function($scope, Global, $state) {
		$scope.global = Global;
		$scope.isCollapsed = false;

		$scope.isSelected = function(name) {
			return $state.current.name === name ? 'selected' : false;
		}
	}
]);/* global mixpanel */

angular.module('mean.public').controller('MealplanCtrl', ['$scope', 'Global', 'Restangular', '$modal', '$state',
	function($scope, Global, Restangular, $modal, $state) {
		if (!Global.user) {
			$state.go('index');
		}

		$scope.user = Global.user;
		$scope.promoText = $scope.user.default_kitchen.promoText;
		var options = {
			mp: true,
			ad: true
		};

		if ($scope.user.paused) {
			$modal.open({
				templateUrl: 'public/settings/reactivateMealplanModal.html',
				scope: $scope,
				windowClass: 'reactivateMealplanModal',
				controller: function($scope, $modalInstance) {
					$scope.dismiss = function() {
						$modalInstance.dismiss();
					};

					$scope.close = function() {
						Restangular.one('users/' + Global.user._id + '/reactivate').put().then(function() {
							$scope.user.paused = false;

							$modalInstance.close();
							saveUser(function() {
								mixpanel.track('Reactivated Mealplan');
								refreshMealplan();
							});
						});
					};
				}
			});
		}

		refreshMealplan();



		function refreshMealplan() {
			Restangular.one('users/me').get(options).then(function(user) {
				Global.user = $scope.user = user.data;
				mixpanel.identify($scope.user.email);
				$scope.promoText = user.data.default_kitchen.promoText;
			});
		}

		function saveUser(callback) {
			var user = Restangular.one('users', Global.user._id);
			user.userData = $scope.user;
			user.put().then(function(resp) {
				// TODO: Alert user of changes
				if (callback) {
					callback();
				}
			});
		}
	}
]);/* global mixpanel, _ */

'use strict';

angular.module('mean.public').controller('SettingsCtrl', ['$scope', 'Global', '$modal', 'Restangular', '$state', '$filter',
	function($scope, Global, $modal, Restangular, $state, $filter) {

		if (!Global.user) {
			$state.go('index');
		}

		var user = Restangular.one('users', Global.user._id);

		$scope.readableTimeConversion = {
			// Morning
			'07:15:00': '7:15-8:00 am',
			'08:00:00': '8:00-8:45 am',
			// Evening
			'17:00:00': '5-6 pm',
			'18:00:00': '6-7 pm',
			'19:00:00': '7-8 pm',
			'20:00:00': '8-9 pm'
		};

		$scope.deliveryDays = [{
			day: 1,
			abbrev: 'Mon'
		}, {
			day: 2,
			abbrev: 'Tue'
		}, {
			day: 3,
			abbrev: 'Wed'
		}, {
			day: 4,
			abbrev: 'Thu'
		}];

		$scope.user = Global.user;
		mixpanel.identify($scope.user.email);
		updateReadableDays();

		$scope.viewBreakdown = buildBreakdown();

		$scope.editDeliveryDays = function() {
			$modal.open({
				templateUrl: 'public/settings/editDeliveryDaysModal.html',
				scope: $scope,
				windowClass: 'editDeliveryDaysModal',
				controller: function($scope, $modalInstance) {
					// Store original values in case user cancels
					var days = _.cloneDeep($scope.user.delivery_preferences);

					$scope.close = function() {
						saveUser();
						updateReadableDays();

						mixpanel.track('Default Days Changed', {
							days: $scope.userDaysReadable
						});

						$scope.$emit('alert', {
							message: 'Your schedule has been updated',
							timeout: 4000
						});

						$modalInstance.close();
					};

					$scope.dismiss = function() {
						$modalInstance.dismiss();
					};

					$modalInstance.result.then(function() {}, function(err) {
						// If modal is dismissed revert changes
						$scope.user.delivery_preferences = days;
					});
				}
			});
		};

		$scope.editDeliveryTime = function() {
			$modal.open({
				templateUrl: 'public/settings/editDeliveryTimeModal.html',
				scope: $scope,
				windowClass: 'editDeliveryTimeModal',
				controller: function($scope, $modalInstance) {
					// Store original values in case user cancels
					var time = $scope.user.deliveryTime.dinner;

					$scope.close = function() {
						// Update data in delivery preferences
						_.forEach($scope.user.delivery_preferences, function(meals, day) {
							if (meals.dinner) {
								meals.dinner.time = $scope.user.deliveryTime.dinner;
							}
						});

						saveUser();

						mixpanel.track('Default Delivery Time Changed', {
							time: $scope.user.deliveryTime
						});

						$scope.$emit('alert', {
							message: 'Your schedule has been updated',
							timeout: 4000
						});

						$modalInstance.close();
					};

					$scope.dismiss = function() {
						$modalInstance.dismiss();
					};

					$modalInstance.result.then(function() {}, function(err) {
						// If modal is dismissed revert changes
						$scope.user.deliveryTime.dinner = time;
					});
				}
			});
		};

		$scope.editAddress = function() {
			$modal.open({
				templateUrl: 'public/settings/editAddressModal.html',
				scope: $scope,
				windowClass: 'editAddressModal',
				controller: function($scope, $modalInstance) {
					// Store original values in case user cancels
					var address = $scope.user.address,
						address2 = $scope.user.address2,
						zip = $scope.user.zip,
						instructions = $scope.user.instructions;


					$scope.$on('continue', function() {
						saveUser();

						mixpanel.track('Default Delivery Address Changed', {
							address: $scope.user.address + ', ' + $scope.user.address2
						});

						$scope.$emit('alert', {
							message: 'Your address has been updated',
							timeout: 4000
						});

						$modalInstance.close();
					});

					$scope.$on('cancel', function() {
						$modalInstance.dismiss();
					});

					$scope.dismiss = function() {
						$modalInstance.dismiss();
					};

					$modalInstance.result.then(function() {}, function(err) {
						// If modal is dismissed revert changes
						$scope.user.address = address;
						$scope.user.address2 = address2;
						$scope.user.zip = zip;
						$scope.user.instructions = instructions;
					});
				}
			});
		};

		$scope.editQuantity = function() {
			$modal.open({
				templateUrl: 'public/settings/editQtyModal.html',
				scope: $scope,
				windowClass: 'editQtyModal',
				controller: function($scope, $modalInstance) {
					var quantity = $scope.user.quantity;

					$scope.close = function() {
						saveUser();

						mixpanel.track('Default Quantity Changed', {
							quantity: $scope.user.quantity
						});

						$scope.$emit('alert', {
							message: 'Your default quantity has been updated',
							timeout: 4000
						});

						$modalInstance.close();
					};

					$scope.dismiss = function() {
						$modalInstance.dismiss();
					};

					$modalInstance.result.then(function() {}, function(err) {
						// If modal is dismissed revert changes
						$scope.user.quantity = quantity;
					});
				}
			});
		};

		$scope.editName = function() {
			$modal.open({
				templateUrl: 'public/settings/editNameModal.html',
				scope: $scope,
				windowClass: 'editNameModal',
				controller: function($scope, $modalInstance) {
					// Store original values in case user cancels
					var name = $scope.user.name;

					$scope.close = function() {
						saveUser();

						mixpanel.track('Name Changed', {
							name: $scope.user.name
						});

						mixpanel.people.set({
							$name: $scope.user.name
						});

						$scope.$emit('alert', {
							message: 'Your name has been updated',
							timeout: 4000
						});

						$modalInstance.close();
					};

					$scope.dismiss = function() {
						$modalInstance.dismiss();
					};

					$modalInstance.result.then(function() {}, function(err) {
						// If modal is dismissed revert changes
						$scope.user.name = name;
					});
				}
			});
		};

		$scope.editEmail = function() {
			$modal.open({
				templateUrl: 'public/settings/editEmailModal.html',
				scope: $scope,
				windowClass: 'editEmailModal',
				controller: function($scope, $modalInstance) {
					// Store original values in case user cancels
					var email = $scope.user.email;

					$scope.close = function() {
						saveUser();

						mixpanel.track('Email Changed', {
							email: $scope.user.email
						});

						mixpanel.people.set({
							$email: $scope.user.email
						});

						$scope.$emit('alert', {
							message: 'Your email has been updated',
							timeout: 4000
						});

						$modalInstance.close();
					};

					$scope.dismiss = function() {
						$modalInstance.dismiss();
					};

					$modalInstance.result.then(function() {}, function(err) {
						// If modal is dismissed revert changes
						$scope.user.email = email;
					});

					//https://gist.github.com/badsyntax/719800
					function isEmail(email) {
						return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
					}
				}
			});
		};

		$scope.editPhone = function() {
			$modal.open({
				templateUrl: 'public/settings/editPhoneModal.html',
				scope: $scope,
				windowClass: 'editPhoneModal',
				controller: function($scope, $modalInstance) {
					// Store original values in case user cancels
					var phone = $scope.user.phone;

					$scope.close = function() {
						saveUser();

						mixpanel.track('Phone Number Changed', {
							phone: $scope.user.phone
						});

						$scope.$emit('alert', {
							message: 'Your phone number has been updated',
							timeout: 4000
						});

						$modalInstance.close();
					};

					$scope.dismiss = function() {
						$modalInstance.dismiss();
					};

					$modalInstance.result.then(function() {}, function(err) {
						// If modal is dismissed revert changes
						$scope.user.phone = phone;
					});
				}
			});
		};

		$scope.changePassword = function() {
			$modal.open({
				templateUrl: 'public/settings/changePasswordModal.html',
				scope: $scope,
				windowClass: 'changePasswordModal',
				controller: function($scope, $modalInstance) {
					// Store original values in case user cancels
					$scope.errors = {};
					$scope.close = function() {
						$scope.showErrors = true;
						if ($scope.user.password === $scope.user.passwordVerify) {
							saveUser();

							$scope.$emit('alert', {
								message: 'Your password has been updated',
								timeout: 4000
							});

							mixpanel.track('Changed Password');
							$modalInstance.close();
						} else {
							$scope.errors.passwordVerify = 'The passwords don\'t match';
						}
					};

					$scope.dismiss = function() {
						$modalInstance.dismiss();
					};

					$scope.updateErrors = function() {
						if ($scope.user.password === $scope.user.passwordVerify) {
							$scope.errors.passwordVerify = undefined;
						}
					};

					$modalInstance.result.then(function() {}, function(err) {
						// If modal is dismissed revert changes
						delete $scope.user.password;
					});
				}
			});
		};

		$scope.editPaymentInfo = function() {
			$modal.open({
				templateUrl: 'public/settings/editPaymentInfoModal.html',
				scope: $scope,
				windowClass: 'editPaymentInfoModal',
				controller: function($scope, $modalInstance) {
					// Store original values in case user cancels
					var name = $scope.user.name,
						phone = $scope.user.phone;

					$scope.dismiss = 'cancel';
					$scope['continue'] = 'submit';


					$scope.$on('cancel', function() {
						$modalInstance.dismiss();
					});

					$scope.$on('continue', function() {
						saveUser();

						mixpanel.track('Updated Payment Information');

						$scope.$emit('alert', {
							message: 'Your payment info has been updated',
							timeout: 4000
						});

						$modalInstance.close();
					});

					$scope.xButton = function() {
						$modalInstance.dismiss();
					};

					$modalInstance.result.then(function() {}, function(err) {
						// If modal is dismissed revert changes
						$scope.user.name = name;
						$scope.user.phone = phone;
					});
				}
			});
		};

		$scope.reactivateMealplan = function() {
			$modal.open({
				templateUrl: 'public/settings/reactivateMealplanModal.html',
				scope: $scope,
				windowClass: 'reactivateMealplanModal',
				controller: function($scope, $modalInstance) {
					// Store original values in case user cancels


					$modalInstance.result.then(function() {}, function(err) {
						// If modal is dismissed revert changes
					});

					$scope.dismiss = function() {
						$modalInstance.dismiss();
					};

					$scope.close = function() {
						Restangular.one('users/' + Global.user._id + '/reactivate').put().then(function() {
							$scope.user.paused = false;
							saveUser(function() {
								mixpanel.track('Reactivated Mealplan');
								$state.go('mealplan');
								$modalInstance.close();

								$scope.$emit('alert', {
									message: 'Your account has been reactivated',
									timeout: 4000,
									survive: 1
								});
							});
						});
					};
				}
			});
		};

		$scope.pauseMealplan = function() {
			$modal.open({
				templateUrl: 'public/settings/pauseMealplanModal.html',
				scope: $scope,
				windowClass: 'pauseMealplanModal',
				controller: function($scope, $modalInstance) {
					// Store original values in case user cancels

					$modalInstance.result.then(function() {}, function(err) {
						// If modal is dismissed revert changes
						delete $scope.cancelReason;
					});

					$scope.dismiss = function() {
						$modalInstance.dismiss();
					};

					$scope.close = function() {
						if ($scope.user.cancelReason) {
							var requestObj = Restangular.one('users/' + Global.user._id + '/pause');
							requestObj.reason = $scope.user.cancelReason;
							requestObj.put().then(function() {
								$scope.user.paused = true;
								mixpanel.track('Paused Mealplan');
								$state.go('mealplan');
								$modalInstance.close();

								$scope.$emit('alert', {
									message: 'Your mealplan has been paused',
									timeout: 4000,
									survive: 1
								});
							});
						} else {
							alert('Please let us know why you\'re pausing your plan.');
						}
					};
				}
			});

			saveUser();
		};

		function updateReadableDays() {
			var dayCounter = 0;
			$scope.userDaysReadable = '';

			var prefs = $scope.user.delivery_preferences;

			_.each($scope.deliveryDays, function(day) {
				if (prefs[day.day] && prefs[day.day].dinner && prefs[day.day].dinner.time) {
					dayCounter++;
					$scope.userDaysReadable += ', ' + day.abbrev
				}
			});

			// Remove leading comma if there is one
			if ($scope.userDaysReadable !== '' && $scope.userDaysReadable !== 'No days selected') {
				$scope.userDaysReadable = $scope.userDaysReadable.substr(1);
			} else {
				$scope.userDaysReadable = 'No days selected';
			}

			if (dayCounter !== 1) {
				$scope.mealsPerWeek = dayCounter + ' meals per week';
			} else {
				$scope.mealsPerWeek = dayCounter + ' meal per week';
			}
		}

		function saveUser(callback) {
			user.userData = $scope.user;
			user.put().then(function(resp) {
				// TODO: Alert user of changes
				if (callback) {
					callback();
				}
			});
		}

		function buildBreakdown() {
			var paymentData = $scope.user.amountDue,
				invoiceLines = paymentData.lines,
				breakdownString = 'Week beginning ' + moment().day(-6).format('dddd, MMM D') + '<br>';

			breakdownString += '<div class=\'divider\'></div>';

			if (invoiceLines) {
				for (var i = 0; i < invoiceLines.count; i++) {
					if (invoiceLines.data[i]) {
						var line = invoiceLines.data[i];
						breakdownString += line.description + ': ' + $filter('currency')(line.amount / 100) + '<br>';
					}
				}
			} else {
				breakdownString += "No deliveries so far!<br>";
			}

			if (paymentData.discount) {
				var coupon = paymentData.discount.coupon;
				if (coupon.percent_off) {
					breakdownString += 'Coupon Applied: ' + coupon.percent_off + '% off' + ' (' + coupon.id + ')<br>';
				} else {
					breakdownString += 'Coupon Applied: $' + coupon.amount_off + ' off' + ' (' + coupon.id + ')<br>';
				}
			}

			breakdownString += '<div class=\'divider\'></div>';
			breakdownString += 'Total due: ' + $filter('currency')(paymentData.amount_due / 100 || 0) + '<br>';
			if ($scope.user.mealCredits > 0) {
				breakdownString += 'Meal Credits Remaining: ' + $scope.user.mealCredits + '<br>';
			}

			return breakdownString;
		}
	}
]);/* global mixpanel */
'use strict';

angular.module('mean.public').controller('SignupCtrl', ['$scope', 'Global', '$FB', '$stateParams', '$location', '$rootScope', 'Restangular', '$state', '$timeout',
	function($scope, Global, $FB, $stateParams, $location, $rootScope, Restangular, $state, $timeout) {
		$scope.global = Global;

		// Redirect to mealplan if user is logged in
		if ($scope.global.user) {
			$state.go('mealplan');
		}

		$scope.user = {
			deliveryTime: {
				dinner: '08:00:00'
			}
		};

		initStep();

		$timeout(function() {
			$scope.initComplete = true;
		}, 1500);

		// Called after flow is created
		$scope.createUser = function() {
			$scope.showSpinner = true;
			if (validateUser()) {
				var data = {
					userData: $scope.user
				};

				if ($scope.couponCode) {
					data.couponData = {
						code: $scope.couponCode
					};
				}

				if ($scope.vegetarian) {
					data.tagData = {
						vegetarian: true
					};
				}

				Restangular.all('users').post(data).then(function(resp) {
					if (resp.status === 'success') {
						// Log the user in
						mixpanel.track('Signup Successful');
						mixpanel.alias($scope.user.email);

						mixpanel.people.set({
							$email: $scope.user.email,
							$created: new Date(),
							$name: $scope.user.name
						});

						if ($scope.user.facebookId) {
							window.location.href = "/auth/facebook";
						} else {
							Restangular.all('users').all('session').post({
								email: $scope.user.email,
								password: $scope.user.password
							}).then(function(resp) {
								window.location.reload();
							});
						}
					} else {
						$scope.showSpinner = false;
						alert(res.data);
						// TODO: Handle error
					}
				}, function(err) {
					if (err && err.data && err.data.data && err.data.data.stripe) {
						alert(err.data.data.stripe.message);
					}

					$scope.showSpinner = false;
				});
			} else {
				$scope.showSpinner = false;
			}
		};

		$scope.stepClass = function() {
			var classString = 'step' + $scope.step;

			if ($scope.global.isMobile) {
				classString += ' notransition';
			}

			return classString;
		};

		$scope.daysSelected = 4;

		// Handles step changes for navigating forward and back in flow
		$rootScope.$on('$locationChangeSuccess', initStep);

		function initStep() {
			if ($scope.lastStep >= -1) {
				$scope.step = $location.path().substr(1) !== '' ? parseInt($location.path().substr(1), 10) : 0;
			} else if (!Global.authenticated) {
				// If lastStep is undefined, it's because the user refreshed,
				// so we restart the flow
				$state.go('index');
				$scope.step = 0;
			}

			$scope.lastStep = $scope.step;
		}

		// Check that someone didn't skip parts of the flow
		function validateUser() {
			var user = $scope.user;
			if (!user.name || !user.email || !user.address || !user.zip || !user.phone || (!user.password && !user.facebookId) || !user.stripeToken) {
				if (!user.address || !user.zip) {
					$state.go('index.address');
				} else if (!user.email || (!user.password && !user.facebookId)) {
					$state.go('index.authType');
				} else if (!user.name || !user.phone || !user.stripeToken) {
					$state.go('index.paymentInfo');
				}
				return false;
			} else {
				return true;
			}
		}
	}
]);'use strict';

angular.module('mean.system').controller('AdminIndexCtrl', ['$scope', 'Global', '$FB',
	function($scope, Global, $FB) {
		$scope.global = Global;

		$scope.fb = function() {
			$FB.login(function(resp) {
				location.href = '/auth/facebook';
			});
		};
	}
]);app.directive('cronJob', ['Restangular', '$modal',
	function(Restangular, $modal) {
		return {
			restrict: 'C',
			scope: {
				jobs: '=jobs',
				owner: '=owner'
			},
			templateUrl: 'directives/kitchen/cronJob.html',
			controller: function($scope, $state, $attrs) {
				// we need to recurse the jobs object and create the jobs collection
				$scope.weekday = new Array(7);
				$scope.weekday[0] = "Sunday";
				$scope.weekday[1] = "Monday";
				$scope.weekday[2] = "Tuesday";
				$scope.weekday[3] = "Wednesday";
				$scope.weekday[4] = "Thursday";
				$scope.weekday[5] = "Friday";
				$scope.weekday[6] = "Saturday";

				$scope.displayTableData = [{
					label: 'Day of Week',
					field: 'weekday'
				}, {
					label: 'Module',
					field: 'module'
				}, {
					label: 'Job Name',
					field: 'job'
				}, {
					label: 'Time',
					field: 'cronTime'
				}, {
					label: 'Data',
					field: 'data'
				}];
				$scope.$watch('jobs', function(jobs) {
					$scope.jobs = jobs;
					$scope.computeJobs(jobs);
				});
				$scope.$watch('owner', function(owner) {
					$scope.owner = owner;
				});
				$scope.computeJobs = function(jobs) {
					$scope.jobList = [];

					_.forOwn(jobs, function(dayJobs, dow) {

						_.forOwn(dayJobs, function(jobData, jobName) {
							_.forOwn(jobData, function(data, time) {
								$scope.jobList.push({
									day: dow,
									weekday: $scope.weekday[dow],
									module: jobName.split(":")[0],
									job: jobName.split(":")[1],
									cronTime: time,
									owner: $scope.owner,
									data: data,
									cron: true
								});
							});
						});
					});
				};

				$scope.jobEdit = function(job) {
					$scope.job = job || {
						isNew: true
					};

					_$scope = $scope;
					$modal.open({
						templateUrl: 'directives/kitchen/createOrModifyCronJob.html',
						controller: function($scope, $modalInstance) {
							$scope.oldJob = _.clone(_$scope.job);
							$scope.job = _$scope.job;
							if (!$scope.job.isNew) $scope.job.name = $scope.job.module + ":" + $scope.job.job;
							$scope.close = function() {
								$modalInstance.close();
							}
							$scope.delete = function(job) {
								_$scope.jobs[job.day][job.module + ":" + job.job][job.cronTime] = undefined;
								_$scope.computeJobs(_$scope.jobs);
								$modalInstance.close();
							}
							$scope.ok = function() {
								if (!$scope.job.isNew) $scope.delete($scope.oldJob);
								// lets clear out the old job
								_$scope.jobs[_$scope.weekday.indexOf($scope.job.weekday).toString()] = _$scope.jobs[_$scope.weekday.indexOf($scope.job.weekday).toString()] || {};
								_$scope.jobs[_$scope.weekday.indexOf($scope.job.weekday).toString()][$scope.job.name] = _$scope.jobs[_$scope.weekday.indexOf($scope.job.weekday).toString()][$scope.job.name] || {};
								_$scope.jobs[_$scope.weekday.indexOf($scope.job.weekday).toString()][$scope.job.name][$scope.job.cronTime] = $scope.job.data;
								_$scope.computeJobs(_$scope.jobs);
								$modalInstance.close();
							}
						}
					});

				};



			}
		};
	}
]);app.directive('deliveryTimes', ['Restangular', '$modal',
	function(Restangular, $modal) {
		return {
			restrict: 'C',
			scope: {
				times: '=times',
				owner: '=owner'
			},
			templateUrl: 'directives/kitchen/deliveryTimes.html',
			controller: function($scope, $state, $attrs) {

			}
		};
	}
]);angular.module('mean.directives').directive('login', function() {
	return {
		restrict: 'C',
		templateUrl: 'public/directives/login.html',
		scope: {},
		controller: function($scope, $state, Restangular, $window, $FB, $modal) {
			$scope.errors = {};
			$scope.login = function() {
				Restangular.all('users').all('session').post({
					email: $scope.email,
					password: $scope.password
				}).then(function(resp) {
					if (resp.status === 'error') {
						$scope.errors.email = resp.data;
					} else {
						// Refresh to get session and go to mealplan page
						$window.location.reload();
					}
				});
			};

			$scope.fbLogin = function() {
				$FB.getLoginStatus().then(function(resp) {
					switch (resp.status) {
						case 'connected':
							// Login
							$window.location.href = '/auth/facebook';
							break;
						case 'not_authorized':
							// Try to authorize
							$FB.login().then(function(resp) {
								if (resp.authResponse) {
									$state.go('index.mealsPerWeek');
								}
							}, {
								scope: 'email'
							});
							break;
						case 'unknown':
							// Force user to login
							$FB.login().then(function(resp) {
								if (resp.authResponse) {
									$window.location.href = '/auth/facebook';
								}
							}, {
								scope: 'email'
							});
							break;
					}
				});
			};

			$scope.forgotPassword = function() {
				$modal.open({
					templateUrl: 'public/home/forgotPassword.html',
					windowClass: 'forgotPassword',
					controller: function($scope, $modalInstance) {
						$scope.errors = {};
						$scope.success = {};
						$scope.sendEmail = function(email) {
							$scope.showErrors = true;
							if (isEmail(email)) {
								Restangular.all('users').all('forgotPassword').post({
									email: email
								}).then(function(resp) {
									if (resp.status === 'success') {
										$scope.success.forgotEmail = resp.data.email;
									} else {
										$scope.errors.forgotEmail = resp.data.email;
									}
								});
							} else {
								$scope.errors.forgotEmail = 'Invalid email';
							}
						};

						$scope.updateErrors = function() {
							$scope.errors = {};
						};

						$scope.dismiss = function() {
							$modalInstance.close();
						};

						//https://gist.github.com/badsyntax/719800
						function isEmail(email) {
							return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
						}
					}
				});
			};

			$scope.clearErrors = function() {
				$scope.errors = {};
			};
		}
	};
});app.directive('mealplanRow', ['Restangular', 'Global',
	function(Restangular, Global) {
		return {
			restrict: 'C',
			scope: {
				meals: '=meals',
				shownMeal: '=shownMeal',
				enabled: '=enabled',
				status: '=status',
				deliveryData: '=deliveryData'
			},
			templateUrl: 'public/directives/mealplan/mealplanRow.html',
			controller: function($scope, $state, $modal, $interval) {
				var _$scope = $scope,
					saveException = function() {
						// we just save the current scope.
						var data;
						if ($scope.deliveryData.cancelled) {
							data = {
								exceptionData: {
									mealTime: $scope.deliveryData.type,
									date: $scope.deliveryData.date,
									exception: _.extend({
										meals: []
									}, $scope.deliveryData)
								}
							};

							_.forOwn($scope.meals, function(meal, key) {
								meal.quantity = 0;
							});
						} else {


							data = {
								exceptionData: {
									mealTime: $scope.deliveryData.type,
									date: $scope.deliveryData.date,
									exception: _.extend({
										meals: []
									}, $scope.deliveryData)
								}
							};
							var priorityMeal = {
								meal: {},
								quantity: 0
							};

							// now we must loop through the $scope.meals to get the meals for the day. NOTE dont save meals with 0 quantity
							for (var mealId in $scope.meals) {
								if ($scope.meals.hasOwnProperty(mealId) && $scope.meals[mealId].quantity > 0) {
									// here we compute the exceptions
									data.exceptionData.exception.meals.push({
										meal: mealId,
										quantity: $scope.meals[mealId].quantity
									});

									// check the quantity to update ui only used on edit quantity modal
									if ($scope.meals[mealId].quantity > priorityMeal.quantity) {
										priorityMeal.quantity = $scope.meals[mealId].quantity
										$scope.shownMeal = $scope.meals[mealId].meal;
										$scope.enabled = true; // we set the class and the ui will update
									}
								}
							}

							if (priorityMeal.quantity === 0) {
								$scope.enabled = false;
							}
						}
						updateDom();
						// update the time ui;

						return Restangular.one('users/' + Global.user._id + '/exception').customPUT(data);
					};

				// Initialize Dom
				updateDom();

				// Update when mealplan object updates 
				$scope.$watch('deliveryData', function() {
					updateDom();
				});

				$scope.editMealOrQuantity = function() {
					if ($scope.status == 'cooking' || $scope.status == 'shipping') {
						return;
					}
					$modal.open({
						templateUrl: 'public/directives/mealplan/editMealOrQuantity.html',
						windowClass: 'editMealOrQuantity',
						controller: function($scope, $modalInstance) {
							// Keeping scopes separate because of a scope sharing issue
							$scope.meals = _.cloneDeep(_$scope.meals);

							$scope.close = function() {
								$modalInstance.close();
							}

							$scope.save = function(data) {
								// Update the parent scope with the new meal data
								_$scope.meals = $scope.meals;

								mixpanel.track('Change Meal or Qty', {
									meals: $scope.meals
								});

								_$scope.$emit('alert', {
									message: 'Your mealplan has been updated',
									timeout: 4000
								});

								$modalInstance.close();

								saveException().then(function(d) {
									// alert
								}, function(err) {
									console.log(err);
								});
							}
						}
					});
				};

				$scope.editAddress = function() {
					if ($scope.status == 'shipping') return;

					$modal.open({
						templateUrl: 'public/directives/mealplan/editAddress.html',
						windowClass: 'editAddressModal',
						scope: $scope,
						controller: function($scope, $modalInstance) {
							$scope.$on('cancel', function() {
								$modalInstance.close();
							});

							$scope.$on('continue', function() {
								saveException().then(function(d) {
									// alert
									mixpanel.track('Edited Delivery Address', {
										date: $scope.deliveryData.date,
										address: $scope.deliveryData
									});

									$scope.$emit('alert', {
										message: 'Your address has been updated',
										timeout: 4000
									});

									$modalInstance.close();
								}, function(err) {
									console.log(err);
								})
							});

							$scope.dismiss = function() {
								$modalInstance.close();
							};
						}
					});
				};

				$scope.editTime = function() {
					if ($scope.status == 'shipping') return;

					$modal.open({
						windowClass: 'editDeliveryTimeModal',
						templateUrl: 'public/directives/mealplan/editDeliveryTime.html',
						scope: $scope,
						controller: function($scope, $modalInstance) {
							var originalTime = $scope.deliveryData.time;

							var cutoff = Global.user.default_kitchen.deliveryTimes["08:00:00"].deliveryCutoff.split(':')[0];
							// $scope.morningCutoff = moment().hour(cutoff) <= moment();
							// console.log($scope.morningCutoff);
							$scope.deliveryData.morningCutoff = moment().hour(cutoff) > moment();


							$modalInstance.result.then(function() {}, function() {
								$scope.deliveryData.time = originalTime;
								updateDom();
							});

							$scope.dismiss = function() {
								$modalInstance.dismiss();
							};

							$scope.close = function() {
								saveException().then(function(d) {
									// alert
									mixpanel.track('Edited Delivery Time', {
										date: $scope.deliveryData.date,
										time: $scope.deliveryData.time
									});
									updateDom();

									$scope.$emit('alert', {
										message: 'Your schedule has been updated',
										timeout: 4000
									});
									$modalInstance.close();
								}, function(err) {
									console.log(err);
								});
							};
						}
					});
				};

				$scope.addMeal = function() {
					if ($scope.status == 'cooking' || $scope.status == 'shipping') return;

					// we simply set the quantity on the $scope.meals for this meal to the users quantity
					var mealId = $scope.shownMeal._id;
					$scope.meals[mealId].quantity = Global.user.quantity;
					$scope.deliveryData.cancelled = undefined;

					if (Global.user.paused) {
						Global.user.paused = false
						var requestObj = Restangular.one('users', Global.user._id);
						requestObj.userData = {
							paused: false,
							delivery_preferences: {
								1: {
									dinner: false
								},
								2: {
									dinner: false
								},
								3: {
									dinner: false
								},
								4: {
									dinner: false
								}
							}
						};
						requestObj.put();
					}

					saveException().then(function(d) {
						mixpanel.track('Added Meal', {
							name: $scope.shownMeal.name,
							quantity: Global.user.quantity
						});
						// alert
					}, function(err) {
						console.log(err);
						$scope.enabled = false;
					});

					$scope.status = 'pending';
					$scope.enabled = true; // instant feedback
				};

				$scope.cancelMeal = function() {
					if ($scope.status == 'cooking' || $scope.status == 'shipping') return;

					$modal.open({
						templateUrl: 'public/directives/mealplan/cancelMeal.html',
						windowClass: 'cancelMealModal',
						scope: $scope,
						controller: function($scope, $modalInstance) {
							$scope.close = function() {
								$modalInstance.close();
							};

							// Keeping scope isolated here as well because of another weird scope issue
							$scope.ok = function() {
								// we simply set the cancelled flag on the $scope.deliveryData
								$scope.deliveryData.cancelled = true;
								mixpanel.track('Cancelled Meal', {
									date: $scope.deliveryData.date
								});

								saveException().then(function(d) {
									// alert
									$scope.$emit('alert', {
										message: 'Your meal has been cancelled',
										timeout: 4000
									});

									$modalInstance.close();

								}, function(err) {
									console.log(err);
									$scope.$parent.enabled = true;
								});

								// Setting directly on parent
								// because otherwise it sets on the modal's scope
								$scope.$parent.enabled = false;
							};
						}
					});
				};


				$interval(updateDom, 10000);

				// TODO: Let's revisit this and see if there's a cleaner/more maintable way to do this code
				function updateDom() {
					var date = moment($scope.deliveryData.date).format('ddd MMM D'),
						offset = moment().tz(Global.user.default_kitchen.timeZone).zone() / 60,
						cutoff = Global.user.default_kitchen.deliveryTimes[$scope.deliveryData.time],
						start_hr = moment($scope.deliveryData.time, 'HH:mm:ss').format('h'),
						end_hr = moment($scope.deliveryData.time, 'HH:mm:ss').add('hours', 1).format('ha'),
						mealTime = moment($scope.deliveryData.date).tz(Global.user.default_kitchen.timeZone).add('hours', offset).hours($scope.deliveryData.time.split(':')[0], $scope.deliveryData.time.split(':')[1]).valueOf(), // will plug in moment timezone so this comes from the kitchen
						qend = moment(mealTime).tz(Global.user.default_kitchen.timeZone).subtract('hours', cutoff.quantityCutoff.split(':')[0]).subtract('minutes', cutoff.quantityCutoff.split(':')[1]).valueOf(),
						dend = moment(mealTime).tz(Global.user.default_kitchen.timeZone).subtract('hours', cutoff.deliveryCutoff.split(':')[0]).subtract('minutes', cutoff.deliveryCutoff.split(':')[1]).valueOf(),
						now = moment().tz(Global.user.default_kitchen.timeZone).valueOf(), // will plug in moment timezone so this comes from the kitchen
						qdiff = qend - now,
						ddiff = dend - now,
						ddays = Math.floor(ddiff / (24 * 36e5)),
						dhours = Math.floor((ddiff % (24 * 36e5)) / 36e5),
						dmins = Math.floor((ddiff % 36e5) / 6e4),
						qdays = Math.floor(qdiff / (24 * 36e5)),
						qhours = Math.floor((qdiff % (24 * 36e5)) / 36e5),
						qmins = Math.floor((qdiff % 36e5) / 6e4);

					if (ddays < 0) {
						$scope.status = 'shipping';
					} else if (qdays < 0) {
						$scope.status = 'cooking';
					} else {
						$scope.status = 'pending';
					}

					// Hack for odd times
					if (end_hr === '9am') {
						start_hr = '8:00';
						end_hr = '8:45am';
					} else if (end_hr === '8am') {
						start_hr = '7:15';
						end_hr = '8:00am';
					}

					if ($scope.shownMeal) {
						$scope.shownMeal.quantityTimeRemaining = qdays + 'd ' + qhours + 'h ' + qmins + 'm ' + 'left';
						$scope.shownMeal.deliveryTimeRemaining = ddays + 'd ' + dhours + 'h ' + dmins + 'm ' + 'left';
						$scope.shownMeal.userTime = '' + date + ', ' + start_hr + ' - ' + end_hr;

						if (!$scope.enabled) {
							$scope.shownMeal.userTime += ' (Not Selected)';
						}

						// we need to update the tooltip or it doesnt show
						$scope.shownMeal.viewInfo = '<img src="' + $scope.shownMeal.nutritionalImageLink + '" />';
						$scope.shownMeal.deliveryDay = ddays > 0 ? 'tomorrow' : 'today';
						$scope.shownMeal.userDeliveryTime = start_hr + ' - ' + end_hr;
					}
				}
			}
		};
	}
]);/* global mixpanel */

angular.module('mean.directives').directive('addressModal', function() {
	return {
		restrict: 'C',
		scope: {
			user: '='
		},
		templateUrl: 'public/directives/signup/addressModal.html',
		controller: function($scope, $state) {
			$scope.$on('cancel', function() {
				$state.go('index.daysAndTime');
			});

			// Listen for successful validation of child
			$scope.$on('continue', function() {
				mixpanel.track('Select Auth Type');
				$state.go('index.authType');
			});
		}
	};
});/* global mixpanel */

angular.module('mean.directives').directive('authTypeModal', function() {
	return {
		restrict: 'C',
		templateUrl: 'public/directives/signup/authTypeModal.html',
		controller: function($scope, $FB, $state, $window) {
			$scope.facebookAuth = function() {
				$FB.getLoginStatus().then(function(resp) {
					switch (resp.status) {
						case 'connected':
							// Login
							$window.location.href = '/auth/facebook';
							break;
						case 'not_authorized':
						case 'unknown':
							// There's an edge case if an existing fb user decides to go through the signup
							// flow again and isn't logged into facebook, they will not be logged in at this point.
							$FB.login(function(resp) {
								if (resp.authResponse) {
									$scope.user.facebookId = resp.authResponse.userID;
									$FB.api('/me', function(resp) {
										$scope.user.email = resp.email;

										mixpanel.track('Auth Selected', {
											type: 'facebook'
										});

										$state.go('index.paymentInfo');
									});
								}
							}, {
								scope: 'email'
							});
							break;
					}
				});
			};

			$scope.emailAuth = function() {
				$scope.user.facebookId = undefined;

				mixpanel.track('Auth Selected', {
					type: 'email'
				});

				$state.go('index.loginInfo');
			};
		}
	};
});/* global mixpanel */

angular.module('mean.directives').directive('daysTimeModal', function() {
	return {
		restrict: 'C',
		templateUrl: 'public/directives/signup/daysTimeModal.html',
		controller: function($scope, $state) {
			$scope.address = function() {
				mixpanel.track('Enter Address');
				$state.go('index.address');
			};

			$scope.$watch('user.delivery_preferences', function() {
				var prefs = $scope.user.delivery_preferences;

				$scope.daysSelected = 0;

				if (prefs) {
					for (var i = 1; i < 5; i++) {
						if (prefs[i] && prefs[i].dinner && prefs[i].dinner.time) {
							$scope.daysSelected++;
						}
					}
				}
			});

			$scope.$watch('user.deliveryTime.dinner', function() {
				_.forEach($scope.user.delivery_preferences, function(meals, day) {
					if (meals.dinner) {
						meals.dinner.time = $scope.user.deliveryTime.dinner;
					}
				});
			});
		}
	};
});/* global mixpanel */

angular.module('mean.directives').directive('emailModal', function() {
	return {
		restrict: 'C',
		templateUrl: 'public/directives/signup/emailModal.html',
		scope: {
			user: '='
		},
		controller: function($scope, $state) {
			var formValid = false;
			$scope.showErrors = false;
			$scope.errors = {};

			$scope.submit = function() {
				_validate();
				$scope.showErrors = true;
				if (formValid) {
					mixpanel.track('Payment Info');
					$state.go('index.paymentInfo');
				}
			};

			$scope.updateErrors = function() {
				_validate();
			};

			function _validate() {
				$scope.errors = {};

				if (!$scope.user.email || !$scope.user.password || !$scope.passwordVerify || !isEmail($scope.user.email) ||
					$scope.passwordVerify !== $scope.user.password) {

					if (!isEmail($scope.user.email)) {
						$scope.errors.email = 'This email is not valid.';
					}

					if (!$scope.user.email) {
						$scope.errors.email = 'Please enter your email.';
					}

					if (!$scope.user.password) {
						$scope.errors.password = 'Please enter a password.';
					} else if (!$scope.passwordVerify) {
						$scope.errors.confirmPassword = 'Please enter the password again.';
					} else if ($scope.passwordVerify !== $scope.user.password) {
						$scope.errors.confirmPassword = 'The passwords do not match.';
					}

					formValid = false;
				} else {
					formValid = true;
				}
			}

			//https://gist.github.com/badsyntax/719800
			function isEmail(email) {
				return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
			}
		}
	};
});/* global mixpanel */

angular.module('mean.directives').directive('homeModal', function() {
	return {
		restrict: 'C',
		templateUrl: 'public/directives/signup/homeModal.html',
		controller: function($scope, $state) {
			$scope.mealsPerWeek = function() {
				mixpanel.track('Meals Per Week');
				$state.go('index.mealsPerWeek');
			};

			mixpanel.track('Home Page');
		}
	};
});/* global mixpanel */

angular.module('mean.directives').directive('mealsPerWeekModal', function() {
	return {
		restrict: 'C',
		templateUrl: 'public/directives/signup/mealsPerWeekModal.html',
		controller: function($scope, $state) {
			$scope.daysAndTime = function() {
				mixpanel.track('Select Days and Time');
				$state.go('index.daysAndTime');
			};
		}
	};
});angular.module('mean.directives').directive('paymentInfoModal', function() {
	return {
		restrict: 'C',
		scope: {
			user: '=',
			couponCode: '=',
			createUser: '='
		},
		templateUrl: 'public/directives/signup/paymentInfoModal.html',
		controller: function($scope, $state, $modal) {
			$scope.signupInfo = true;
			$scope.dismiss = 'go back';
			$scope['continue'] = 'view your mealplan';

			$scope.$on('continue', function() {
				$scope.createUser();
			});

			$scope.$on('cancel', function() {
				$state.go('index.loginInfo');
			});

			$scope.tosModal = function() {
				$modal.open({
					templateUrl: 'public/home/termsOfService.html',
					controller: function($scope, $modalInstance) {
						$scope.close = function() {
							$modalInstance.close();
						};
					}
				});
			};

			$scope.privacyPolicyModal = function() {
				$modal.open({
					templateUrl: 'public/home/privacyPolicy.html',
					controller: function($scope, $modalInstance) {
						$scope.close = function() {
							$modalInstance.close();
						};
					}
				});
			};
		}
	};
});angular.module('mean.directives').directive('upcomingMeals', function() {
	return {
		restrict: 'A',
		templateUrl: 'public/directives/upcomingMeals.html',
		controller: function($scope, $timeout, Moment, Restangular) {
			var calendar,
				searchDay = new Moment().add('d', 1),
				upcomingDays = [];

			$scope.tagChanging = false;
			$scope.upcomingMeals = {
				none: [],
				veggie: []
			};


			$scope.tag = 'none';
			// Fade out the existing images, then fade in the new ones
			$scope.setTag = function(tag) {
				$scope.tagChanging = true;
				$timeout(function() {
					$scope.tag = tag;
					$timeout(function() {
						$scope.tagChanging = false;
					}, 250);
				}, 250);
			};

			Restangular.all('calendars').getList().then(function(calendars) {
				calendar = calendars.data[0];
				for (var i = 0; i < 30 && upcomingDays.length < 4; i++) {
					if (calendar.meals[searchDay.format('YYYY-MM-DD')]) {
						upcomingDays.push(calendar.meals[searchDay.format('YYYY-MM-DD')].dinner);
					}
					searchDay.add('d', 1);
				}

				if (upcomingDays.length > 0) {
					for (i = 0; i < upcomingDays.length; i++) {
						var day = upcomingDays[i];

						addMeal(day[0], 'none', i);
						addMeal(day[1], 'veggie', i);
					}
				} else {
					// TODO: Have some default meals
					$scope.upcomingMeals = [];
				}

			});

			function addMeal(mealId, tag, index) {
				Restangular.one('meals', mealId).get().then(function(meal) {
					$scope.upcomingMeals[tag][index] = meal.data;
				});
			}
		}
	};
});angular.module('mean.directives').directive('editAddress', function() {
	return {
		restrict: 'C',
		templateUrl: 'public/directives/user/editAddress.html',
		scope: {
			user: '=',
			dismiss: '@',
			continue: '@'
		},
		controller: function($scope) {
			var formValid = false;

			$scope.showErrors = false;

			$scope.errors = {};

			$scope.updateErrors = function() {
				_validate();
			};

			$scope.submit = function() {
				_validate();
				$scope.showErrors = true;
				if (formValid) {
					$scope.$emit('continue');
				}
			};

			$scope.cancel = function() {
				$scope.$emit('cancel');
			};

			function _validate() {
				var user = $scope.user,
					zipsSupported = [
						'94102',
						'94103',
						'94104',
						'94105',
						'94107',
						'94108',
						'94109',
						'94110',
						'94111',
						'94114',
						'94115',
						'94116',
						'94117',
						'94118',
						'94121',
						'94122',
						'94123',
						'94131',
						'94133',
						'94158'
					];

				$scope.errors = {};

				if (!user.address || !user.zip || zipsSupported.indexOf(user.zip) === -1) {
					if (!user.address) {
						$scope.errors.address = 'Please enter your address.';
					}

					if (!user.zip) {
						$scope.errors.zip = 'Please enter your zip code.';
					} else if (zipsSupported.indexOf(user.zip) === -1) {
						$scope.errors.zip = 'We don\'t serve this zip yet!';
					}

					formValid = false;
				} else {
					formValid = true;
				}
			}
		}
	};
});angular.module('mean.directives').directive('editDeliveryDays', function() {
	return {
		restrict: 'C',
		templateUrl: 'public/directives/user/editDeliveryDays.html',
		scope: {
			user: '='
		},
		controller: function($scope) {
			// Data is organized this way because order matters
			// and storing as an object doesn't guarantee order in ng-repeat
			$scope.deliveryDays = [{
				day: 1,
				abbrev: 'Mon'
			}, {
				day: 2,
				abbrev: 'Tue'
			}, {
				day: 3,
				abbrev: 'Wed'
			}, {
				day: 4,
				abbrev: 'Thu'
			}];


			if ($scope.user && !$scope.user.delivery_preferences) {
				$scope.user.delivery_preferences = {};
			}

			$scope.isSelected = function(day) {
				if ($scope.user &&
					$scope.user.delivery_preferences &&
					$scope.user.delivery_preferences[day] &&
					$scope.user.delivery_preferences[day].dinner &&
					$scope.user.delivery_preferences[day].dinner.time) {
					return 'selected';
				} else {
					return false;
				}
			};

			$scope.select = function(day) {
				if ($scope.user.delivery_preferences[day] && $scope.user.delivery_preferences[day].dinner) {
					$scope.user.delivery_preferences[day].dinner = false;
				} else {
					$scope.user.delivery_preferences[day] = {
						dinner: {
							time: $scope.user.deliveryTime.dinner
						}
					};
				}
			};
		}
	};
});angular.module('mean.directives').directive('editDeliveryTime', function() {
	return {
		restrict: 'C',
		templateUrl: 'public/directives/user/editDeliveryTime.html',
		scope: {
			time: '=',
			morningCutoff: '='
		},
		controller: function($scope) {
			$scope.deliveryTimes = [{
				// Morning
				'07:15:00': '7:15-8:00 am',
				'08:00:00': '8:00-8:45 am',
			}, {
				// Evening
				'17:00:00': '5-6 pm',
				'18:00:00': '6-7 pm',
				'19:00:00': '7-8 pm',
				'20:00:00': '8-9 pm'
			}];

			// Initialize if needed
			if (!$scope.time) {
				$scope.time = '08:00:00';
			}

			$scope.isSelected = function(time) {
				console.log($scope.morningCutoff);
				if ($scope.morningCutoff && (time === '07:15:00' || time === '08:00:00')) {
					return 'disabled'
				} else {
					return time === $scope.time ? 'selected' : false;
				}
			};

			$scope.select = function(time) {
				$scope.time = time;
			};
		}
	};
});/* global Stripe */

angular.module('mean.directives').directive('editPaymentInfo', function() {
	return {
		restrict: 'C',
		templateUrl: 'public/directives/user/editPaymentInfo.html',
		controller: function($scope) {
			$scope.paymentFormValid = false;
			$scope.showErrors = false;
			$scope.errors = {};

			$scope.submit = function() {
				$scope.showErrors = true;
				shallowValidate();
				if ($scope.paymentFormValid) {
					_validate();
				}
			};

			$scope.cancel = function() {
				$scope.$emit('cancel');
			};

			$scope.updateErrors = function() {
				shallowValidate();
			};

			function shallowValidate() {
				$scope.errors = {};

				if (!$scope.user.name || !$scope.user.phone || $scope.user.phone.length < 7 || !Stripe.card.validateCardNumber($scope.cardNumber) || !Stripe.card.validateCVC($scope.cvc) || !Stripe.card.validateExpiry($scope.expMonth, $scope.expYear) || !$scope.billingZip) {
					if (!$scope.user.name) {
						$scope.errors.name = 'Please enter your name.';
					}

					if (!$scope.user.phone || $scope.user.phone.length < 7) {
						$scope.errors.phone = 'Please enter a valid phone number.';
					}

					if (!Stripe.card.validateCardNumber($scope.cardNumber)) {
						$scope.errors.card = 'This number is invalid.';
					}

					if (!Stripe.card.validateCVC($scope.cvc)) {
						$scope.errors.cvc = 'This cvc is invalid.';
					}

					if (!Stripe.card.validateExpiry($scope.expMonth, $scope.expYear)) {
						$scope.errors.expiration = 'Please use MM and YYYY.';
					}

					if (!$scope.billingZip) {
						$scope.errors.zip = 'Please enter a zip code.';
					}

					$scope.paymentFormValid = false;
				} else {
					$scope.paymentFormValid = true;
				}
			}

			function _validate() {
				Stripe.card.createToken({
					name: $scope.user.name,
					number: $scope.cardNumber,
					cvc: $scope.cvc,
					exp_month: $scope.expMonth,
					exp_year: $scope.expYear,
					address_zip: $scope.billingZip
				}, stripeResponseHandler);
			}

			function stripeResponseHandler(status, response) {
				if (response.error) {
					var error = response.error;
					if (error.type === 'api_error') {
						$scope.cardError = 'Issue processing your card. Please try again.';
					} else if (error.type === 'invalid_request_error') {
						$scope.cardError = 'An error has occurred. Please contact help@chefler.com.';
					} else {
						switch (error.code) {
							case 'incorrect_number':
							case 'invalid_number':
							case 'expired_card':
							case 'processing_error':
							case 'card_declined':
								$scope.errors.card = error.message;
								break;
							case 'invalid_expiry_month':
							case 'invalid_expiry_year':
								$scope.errors.expiration = error.message;
								break;
							case 'invalid_cvc':
							case 'incorrect_cvc':
								$scope.errors.cvc = error.message;
								break;
							case 'incorrect_zip':
								$scope.errors.zip = error.message;
								break;
							default:
								$scope.errors.card = 'Something went wrong! Please contact help@chefler.com';
								break;
						}
					}
					$scope.showErrors = true;
				} else {
					$scope.user.stripeToken = response.id;
					$scope.$emit('continue');
				}
			}
		}
	};
});angular.module('mean.directives').directive('editQty', function() {
	return {
		restrict: 'C',
		templateUrl: 'public/directives/user/editQty.html',
		scope: {
			count: '=',
			min: '@'
		},
		controller: function($scope) {
			if (typeof $scope.min !== 'number') {
				$scope.min = 0;
			}

			$scope.updateQty = function(modifier) {
				if ($scope.count + modifier >= $scope.min) {
					$scope.count = parseInt($scope.count) + modifier;
				}
			};
		}
	};
});angular.module('mean.directives').directive('mealsPerWeek', function() {
	return {
		restrict: 'C',
		scope: {
			user: '='
		},
		templateUrl: 'public/directives/user/mealsPerWeek.html',
		controller: function($scope) {
			// Setup display data
			$scope.mealData = [{
				count: 4,
				fullPrice: '$7'
			}, {
				count: 3,
				fullPrice: '$8'
			}, {
				count: 2,
				fullPrice: '$8'
			}, {
				count: 1,
				fullPrice: '$10'
			}];

			$scope.isSelected = function(count) {
				return $scope.daysSelected === count ? 'selected' : '';
			};

			// Populate user object with delivery preferences
			// based on what's selected here
			$scope.select = function(count) {
				$scope.daysSelected = count;
				var prefs = $scope.user.delivery_preferences = {};

				switch (count) {
					case 4:
						/* falls through */
						prefs[4] = {
							dinner: {
								time: $scope.user.deliveryTime.dinner
							}
						};
					case 3:
						/* falls through */
						prefs[3] = {
							dinner: {
								time: $scope.user.deliveryTime.dinner
							}
						};
					case 2:
						/* falls through */
						prefs[2] = {
							dinner: {
								time: $scope.user.deliveryTime.dinner
							}
						};
					case 1:
						prefs[1] = {
							dinner: {
								time: $scope.user.deliveryTime.dinner
							}
						};
						break;
				}
			};

			// Populate with existing count of meals, default to 4
			var prefs = $scope.user.delivery_preferences,
				existingMealCount = 0;

			if (prefs) {
				for (var i = 1; i < 5; i++) {
					if (prefs[i] && prefs[i].dinner && prefs[i].dinner.time) {
						existingMealCount++;
					}
				}
			}

			if (!existingMealCount) {
				$scope.select(4);
			} else {
				$scope.daysSelected = existingMealCount;
			}
		}
	};
});'use strict';

window.bootstrap = function() {
	angular.bootstrap(document, ['mean']);
};

window.init = function() {
	window.bootstrap();
};

angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') {
		window.location.hash = '';
	}

	//Then init the app
	window.init();
});// moment-timezone.js
// moment-timezone.js
// version : 0.0.3
// author : Tim Wood
// license : MIT
// github.com/timrwood/moment-timezone

(function() {

	var VERSION = "0.0.3";

	function onload(moment) {
		var oldZoneName = moment.fn.zoneName,
			oldZoneAbbr = moment.fn.zoneAbbr,

			defaultRule,
			rules = {},
			ruleSets = {},
			zones = {},
			zoneSets = {},
			links = {},

			TIME_RULE_WALL_CLOCK = 0,
			TIME_RULE_UTC = 1,
			TIME_RULE_STANDARD = 2,

			DAY_RULE_DAY_OF_MONTH = 7,
			DAY_RULE_LAST_WEEKDAY = 8;

		// converts time in the HH:mm:ss format to absolute number of minutes
		function parseMinutes(input) {
			input = input + '';
			var output = input.split(':'),
				sign = ~input.indexOf('-') ? -1 : 1,
				hour = Math.abs(+output[0]),
				minute = parseInt(output[1], 10) || 0,
				second = parseInt(output[2], 10) || 0;

			return sign * ((hour * 60) + (minute) + (second / 60));
		}

		/************************************
			Rules
		************************************/

		function Rule(name, startYear, endYear, month, day, dayRule, time, timeRule, offset, letters) {
			this.name = name;
			this.startYear = +startYear;
			this.endYear = +endYear;
			this.month = +month;
			this.day = +day;
			this.dayRule = +dayRule;
			this.time = parseMinutes(time);
			this.timeRule = +timeRule;
			this.offset = parseMinutes(offset);
			this.letters = letters || '';
		}

		Rule.prototype = {
			contains: function(year) {
				return (year >= this.startYear && year <= this.endYear);
			},

			start: function(year) {
				year = Math.min(Math.max(year, this.startYear), this.endYear);
				return moment.utc([year, this.month, this.date(year), 0, this.time]);
			},

			date: function(year) {
				if (this.dayRule === DAY_RULE_DAY_OF_MONTH) {
					return this.day;
				} else if (this.dayRule === DAY_RULE_LAST_WEEKDAY) {
					return this.lastWeekday(year);
				}
				return this.weekdayAfter(year);
			},

			weekdayAfter: function(year) {
				var day = this.day,
					firstDayOfWeek = moment([year, this.month, 1]).day(),
					output = this.dayRule + 1 - firstDayOfWeek;

				while (output < day) {
					output += 7;
				}

				return output;
			},

			lastWeekday: function(year) {
				var day = this.day,
					dow = day % 7,
					lastDowOfMonth = moment([year, this.month + 1, 1]).day(),
					daysInMonth = moment([year, this.month, 1]).daysInMonth(),
					output = daysInMonth + (dow - (lastDowOfMonth - 1)) - (~~(day / 7) * 7);

				if (dow >= lastDowOfMonth) {
					output -= 7;
				}
				return output;
			}
		};

		/************************************
			Rule Year
		************************************/

		function RuleYear(year, rule) {
			this.rule = rule;
			this.start = rule.start(year);
		}

		RuleYear.prototype = {
			equals: function(other) {
				if (!other || other.rule !== this.rule) {
					return false;
				}
				return Math.abs(other.start - this.start) < 86400000; // 24 * 60 * 60 * 1000
			}
		};

		function sortRuleYears(a, b) {
			if (a.isLast) {
				return -1;
			}
			if (b.isLast) {
				return 1;
			}
			return b.start - a.start;
		}

		/************************************
			Rule Sets
		************************************/

		function RuleSet(name) {
			this.name = name;
			this.rules = [];
		}

		RuleSet.prototype = {
			add: function(rule) {
				this.rules.push(rule);
			},

			ruleYears: function(mom, lastZone) {
				var i, j,
					year = mom.year(),
					rule,
					lastZoneRule,
					rules = [];

				for (i = 0; i < this.rules.length; i++) {
					rule = this.rules[i];
					if (rule.contains(year)) {
						rules.push(new RuleYear(year, rule));
					} else if (rule.contains(year + 1)) {
						rules.push(new RuleYear(year + 1, rule));
					}
				}
				rules.push(new RuleYear(year - 1, this.lastYearRule(year - 1)));

				if (lastZone) {
					lastZoneRule = new RuleYear(year - 1, lastZone.lastRule());
					lastZoneRule.start = lastZone.until.clone().utc();
					lastZoneRule.isLast = lastZone.ruleSet !== this;
					rules.push(lastZoneRule);
				}

				rules.sort(sortRuleYears);
				return rules;
			},

			rule: function(mom, offset, lastZone) {
				var rules = this.ruleYears(mom, lastZone),
					lastOffset = 0,
					rule,
					lastZoneOffset,
					lastZoneOffsetAbs,
					lastRule,
					i;

				if (lastZone) {
					lastZoneOffset = lastZone.offset + lastZone.lastRule().offset;
					lastZoneOffsetAbs = Math.abs(lastZoneOffset) * 90000;
				}

				// make sure to include the previous rule's offset
				for (i = rules.length - 1; i > -1; i--) {
					lastRule = rule;
					rule = rules[i];

					if (rule.equals(lastRule)) {
						continue;
					}

					if (lastZone && !rule.isLast && Math.abs(rule.start - lastZone.until) <= lastZoneOffsetAbs) {
						lastOffset += lastZoneOffset - offset;
					}

					if (rule.rule.timeRule === TIME_RULE_STANDARD) {
						lastOffset = offset;
					}

					if (rule.rule.timeRule !== TIME_RULE_UTC) {
						rule.start.add('m', -lastOffset);
					}

					lastOffset = rule.rule.offset + offset;
				}

				for (i = 0; i < rules.length; i++) {
					rule = rules[i];
					if (mom >= rule.start && !rule.isLast) {
						return rule.rule;
					}
				}

				return defaultRule;
			},

			lastYearRule: function(year) {
				var i,
					rule,
					start,
					bestRule = defaultRule,
					largest = -1e30;

				for (i = 0; i < this.rules.length; i++) {
					rule = this.rules[i];
					if (year >= rule.startYear) {
						start = rule.start(year);
						if (start > largest) {
							largest = start;
							bestRule = rule;
						}
					}
				}

				return bestRule;
			}
		};

		/************************************
			Zone
		************************************/

		function Zone(name, offset, ruleSet, letters, until, untilOffset) {
			var i,
				untilArray = typeof until === 'string' ? until.split('_') : [9999];

			this.name = name;
			this.offset = parseMinutes(offset);
			this.ruleSet = ruleSet;
			this.letters = letters;

			for (i = 0; i < untilArray.length; i++) {
				untilArray[i] = +untilArray[i];
			}
			this.until = moment.utc(untilArray).subtract('m', parseMinutes(untilOffset));
		}

		Zone.prototype = {
			rule: function(mom, lastZone) {
				return this.ruleSet.rule(mom, this.offset, lastZone);
			},

			lastRule: function() {
				if (!this._lastRule) {
					this._lastRule = this.rule(this.until);
				}
				return this._lastRule;
			},

			format: function(rule) {
				return this.letters.replace("%s", rule.letters);
			}
		};

		/************************************
			Zone Set
		************************************/

		function sortZones(a, b) {
			return a.until - b.until;
		}

		function ZoneSet(name) {
			this.name = normalizeName(name);
			this.displayName = name;
			this.zones = [];
		}

		ZoneSet.prototype = {
			zoneAndRule: function(mom) {
				var i,
					zone,
					lastZone;

				mom = mom.clone().utc();
				for (i = 0; i < this.zones.length; i++) {
					zone = this.zones[i];
					if (mom < zone.until) {
						break;
					}
					lastZone = zone;
				}

				return [zone, zone.rule(mom, lastZone)];
			},

			add: function(zone) {
				this.zones.push(zone);
				this.zones.sort(sortZones);
			},

			format: function(mom) {
				var zoneAndRule = this.zoneAndRule(mom);
				return zoneAndRule[0].format(zoneAndRule[1]);
			},

			offset: function(mom) {
				var zoneAndRule = this.zoneAndRule(mom);
				return -(zoneAndRule[0].offset + zoneAndRule[1].offset);
			}
		};

		/************************************
			Global Methods
		************************************/

		function addRules(rules) {
			var i, j, rule;
			for (i in rules) {
				rule = rules[i];
				for (j = 0; j < rule.length; j++) {
					addRule(i + '\t' + rule[j]);
				}
			}
		}

		function addRule(ruleString) {
			// don't duplicate rules
			if (rules[ruleString]) {
				return rules[ruleString];
			}

			var p = ruleString.split(/\s/),
				name = normalizeName(p[0]),
				rule = new Rule(name, p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9], p[10]);

			// cache the rule so we don't add it again
			rules[ruleString] = rule;

			// add to the ruleset
			getRuleSet(name).add(rule);

			return rule;
		}

		function normalizeName(name) {
			return (name || '').toLowerCase().replace(/\//g, '_');
		}

		function addZones(zones) {
			var i, j, zone;
			for (i in zones) {
				zone = zones[i];
				for (j = 0; j < zone.length; j++) {
					addZone(i + '\t' + zone[j]);
				}
			}
		}

		function addLinks(linksToAdd) {
			var i;
			for (i in linksToAdd) {
				links[normalizeName(i)] = normalizeName(linksToAdd[i]);
			}
		}

		function addZone(zoneString) {
			// don't duplicate zones
			if (zones[zoneString]) {
				return zones[zoneString];
			}

			var p = zoneString.split(/\s/),
				name = normalizeName(p[0]),
				zone = new Zone(name, p[1], getRuleSet(p[2]), p[3], p[4], p[5]);

			// cache the zone so we don't add it again
			zones[zoneString] = zone;

			// add to the zoneset
			getZoneSet(p[0]).add(zone);

			return zone;
		}

		function getRuleSet(name) {
			name = normalizeName(name);
			if (!ruleSets[name]) {
				ruleSets[name] = new RuleSet(name);
			}
			return ruleSets[name];
		}

		function getZoneSet(name) {
			var machineName = normalizeName(name);
			if (links[machineName]) {
				machineName = links[machineName];
			}
			if (!zoneSets[machineName]) {
				zoneSets[machineName] = new ZoneSet(name);
			}
			return zoneSets[machineName];
		}

		function add(data) {
			if (!data) {
				return;
			}
			if (data.zones) {
				addZones(data.zones);
			}
			if (data.rules) {
				addRules(data.rules);
			}
			if (data.links) {
				addLinks(data.links);
			}
		}

		// overwrite moment.updateOffset
		moment.updateOffset = function(mom) {
			var offset;
			if (mom._z) {
				offset = mom._z.offset(mom);
				if (Math.abs(offset) < 16) {
					offset = offset / 60;
				}
				mom.zone(offset);
			}
		};

		function getZoneSets() {
			var sets = [],
				zoneName;
			for (zoneName in zoneSets) {
				sets.push(zoneSets[zoneName]);
			}
			return sets;
		}

		moment.fn.tz = function(name) {
			if (name) {
				this._z = getZoneSet(name);
				if (this._z) {
					moment.updateOffset(this);
				}
				return this;
			}
			if (this._z) {
				return this._z.displayName;
			}
		};

		moment.fn.zoneName = function() {
			if (this._z) {
				return this._z.format(this);
			}
			return oldZoneName.call(this);
		};

		moment.fn.zoneAbbr = function() {
			if (this._z) {
				return this._z.format(this);
			}
			return oldZoneAbbr.call(this);
		};

		moment.tz = function() {
			var args = [],
				i, len = arguments.length - 1;
			for (i = 0; i < len; i++) {
				args[i] = arguments[i];
			}
			var m = moment.apply(null, args);
			var preTzOffset = m.zone();
			m.tz(arguments[len]);
			return m.add('minutes', m.zone() - preTzOffset);
		};

		moment.tz.add = add;
		moment.tz.addRule = addRule;
		moment.tz.addZone = addZone;
		moment.tz.zones = getZoneSets;

		moment.tz.version = VERSION;

		// add default rule
		defaultRule = addRule("- 0 9999 0 0 0 0 0 0");

		return moment;
	}

	if (typeof define === "function" && define.amd) {
		define("moment-timezone", ["moment"], onload);
	} else if (typeof window !== "undefined" && window.moment) {
		onload(window.moment);
	} else if (typeof module !== 'undefined') {
		module.exports = onload(require('moment'));
	}
}).apply(this);moment.tz.add({
	"zones": {
		"Africa/Abidjan": [
			"-0:16:8 - LMT 1912 -0:16:8",
			"0 - GMT"
		],
		"Africa/Accra": [
			"-0:0:52 - LMT 1918 -0:0:52",
			"0 Ghana %s"
		],
		"Africa/Addis_Ababa": [
			"2:34:48 - LMT 1870 2:34:48",
			"2:35:20 - ADMT 1936_4_5 2:35:20",
			"3 - EAT"
		],
		"Africa/Algiers": [
			"0:12:12 - LMT 1891_2_15_0_1 0:12:12",
			"0:9:21 - PMT 1911_2_11 0:9:21",
			"0 Algeria WE%sT 1940_1_25_2",
			"1 Algeria CE%sT 1946_9_7 1",
			"0 - WET 1956_0_29",
			"1 - CET 1963_3_14 1",
			"0 Algeria WE%sT 1977_9_21 1",
			"1 Algeria CE%sT 1979_9_26 1",
			"0 Algeria WE%sT 1981_4",
			"1 - CET"
		],
		"Africa/Asmara": [
			"2:35:32 - LMT 1870 2:35:32",
			"2:35:32 - AMT 1890 2:35:32",
			"2:35:20 - ADMT 1936_4_5 2:35:20",
			"3 - EAT"
		],
		"Africa/Bamako": [
			"-0:32 - LMT 1912 -0:32",
			"0 - GMT 1934_1_26",
			"-1 - WAT 1960_5_20 -1",
			"0 - GMT"
		],
		"Africa/Bangui": [
			"1:14:20 - LMT 1912 1:14:20",
			"1 - WAT"
		],
		"Africa/Banjul": [
			"-1:6:36 - LMT 1912 -1:6:36",
			"-1:6:36 - BMT 1935 -1:6:36",
			"-1 - WAT 1964 -1",
			"0 - GMT"
		],
		"Africa/Bissau": [
			"-1:2:20 - LMT 1911_4_26 -1:2:20",
			"-1 - WAT 1975 -1",
			"0 - GMT"
		],
		"Africa/Blantyre": [
			"2:20 - LMT 1903_2 2:20",
			"2 - CAT"
		],
		"Africa/Brazzaville": [
			"1:1:8 - LMT 1912 1:1:8",
			"1 - WAT"
		],
		"Africa/Bujumbura": [
			"1:57:28 - LMT 1890 1:57:28",
			"2 - CAT"
		],
		"Africa/Cairo": [
			"2:5:9 - LMT 1900_9 2:5:9",
			"2 Egypt EE%sT"
		],
		"Africa/Casablanca": [
			"-0:30:20 - LMT 1913_9_26 -0:30:20",
			"0 Morocco WE%sT 1984_2_16",
			"1 - CET 1986 1",
			"0 Morocco WE%sT"
		],
		"Africa/Ceuta": [
			"-0:21:16 - LMT 1901 -0:21:16",
			"0 - WET 1918_4_6_23",
			"1 - WEST 1918_9_7_23 1",
			"0 - WET 1924",
			"0 Spain WE%sT 1929",
			"0 SpainAfrica WE%sT 1984_2_16",
			"1 - CET 1986 1",
			"1 EU CE%sT"
		],
		"Africa/Conakry": [
			"-0:54:52 - LMT 1912 -0:54:52",
			"0 - GMT 1934_1_26",
			"-1 - WAT 1960 -1",
			"0 - GMT"
		],
		"Africa/Dakar": [
			"-1:9:44 - LMT 1912 -1:9:44",
			"-1 - WAT 1941_5 -1",
			"0 - GMT"
		],
		"Africa/Dar_es_Salaam": [
			"2:37:8 - LMT 1931 2:37:8",
			"3 - EAT 1948 3",
			"2:45 - BEAUT 1961 2:45",
			"3 - EAT"
		],
		"Africa/Djibouti": [
			"2:52:36 - LMT 1911_6 2:52:36",
			"3 - EAT"
		],
		"Africa/Douala": [
			"0:38:48 - LMT 1912 0:38:48",
			"1 - WAT"
		],
		"Africa/El_Aaiun": [
			"-0:52:48 - LMT 1934_0 -0:52:48",
			"-1 - WAT 1976_3_14 -1",
			"0 - WET"
		],
		"Africa/Freetown": [
			"-0:53 - LMT 1882 -0:53",
			"-0:53 - FMT 1913_5 -0:53",
			"-1 SL %s 1957 -1",
			"0 SL %s"
		],
		"Africa/Gaborone": [
			"1:43:40 - LMT 1885 1:43:40",
			"1:30 - SAST 1903_2 1:30",
			"2 - CAT 1943_8_19_2 2",
			"3 - CAST 1944_2_19_2 3",
			"2 - CAT"
		],
		"Africa/Harare": [
			"2:4:12 - LMT 1903_2 2:4:12",
			"2 - CAT"
		],
		"Africa/Johannesburg": [
			"1:52 - LMT 1892_1_8 1:52",
			"1:30 - SAST 1903_2 1:30",
			"2 SA SAST"
		],
		"Africa/Juba": [
			"2:6:24 - LMT 1931 2:6:24",
			"2 Sudan CA%sT 2000_0_15_12 2",
			"3 - EAT"
		],
		"Africa/Kampala": [
			"2:9:40 - LMT 1928_6 2:9:40",
			"3 - EAT 1930 3",
			"2:30 - BEAT 1948 2:30",
			"2:45 - BEAUT 1957 2:45",
			"3 - EAT"
		],
		"Africa/Khartoum": [
			"2:10:8 - LMT 1931 2:10:8",
			"2 Sudan CA%sT 2000_0_15_12 2",
			"3 - EAT"
		],
		"Africa/Kigali": [
			"2:0:16 - LMT 1935_5 2:0:16",
			"2 - CAT"
		],
		"Africa/Kinshasa": [
			"1:1:12 - LMT 1897_10_9 1:1:12",
			"1 - WAT"
		],
		"Africa/Lagos": [
			"0:13:36 - LMT 1919_8 0:13:36",
			"1 - WAT"
		],
		"Africa/Libreville": [
			"0:37:48 - LMT 1912 0:37:48",
			"1 - WAT"
		],
		"Africa/Lome": [
			"0:4:52 - LMT 1893 0:4:52",
			"0 - GMT"
		],
		"Africa/Luanda": [
			"0:52:56 - LMT 1892 0:52:56",
			"0:52:4 - AOT 1911_4_26 0:52:4",
			"1 - WAT"
		],
		"Africa/Lubumbashi": [
			"1:49:52 - LMT 1897_10_9 1:49:52",
			"2 - CAT"
		],
		"Africa/Lusaka": [
			"1:53:8 - LMT 1903_2 1:53:8",
			"2 - CAT"
		],
		"Africa/Malabo": [
			"0:35:8 - LMT 1912 0:35:8",
			"0 - GMT 1963_11_15",
			"1 - WAT"
		],
		"Africa/Maputo": [
			"2:10:20 - LMT 1903_2 2:10:20",
			"2 - CAT"
		],
		"Africa/Maseru": [
			"1:50 - LMT 1903_2 1:50",
			"2 - SAST 1943_8_19_2 2",
			"3 - SAST 1944_2_19_2 3",
			"2 - SAST"
		],
		"Africa/Mbabane": [
			"2:4:24 - LMT 1903_2 2:4:24",
			"2 - SAST"
		],
		"Africa/Mogadishu": [
			"3:1:28 - LMT 1893_10 3:1:28",
			"3 - EAT 1931 3",
			"2:30 - BEAT 1957 2:30",
			"3 - EAT"
		],
		"Africa/Monrovia": [
			"-0:43:8 - LMT 1882 -0:43:8",
			"-0:43:8 - MMT 1919_2 -0:43:8",
			"-0:44:30 - LRT 1972_4 -0:44:30",
			"0 - GMT"
		],
		"Africa/Nairobi": [
			"2:27:16 - LMT 1928_6 2:27:16",
			"3 - EAT 1930 3",
			"2:30 - BEAT 1940 2:30",
			"2:45 - BEAUT 1960 2:45",
			"3 - EAT"
		],
		"Africa/Ndjamena": [
			"1:0:12 - LMT 1912 1:0:12",
			"1 - WAT 1979_9_14 1",
			"2 - WAST 1980_2_8 2",
			"1 - WAT"
		],
		"Africa/Niamey": [
			"0:8:28 - LMT 1912 0:8:28",
			"-1 - WAT 1934_1_26 -1",
			"0 - GMT 1960",
			"1 - WAT"
		],
		"Africa/Nouakchott": [
			"-1:3:48 - LMT 1912 -1:3:48",
			"0 - GMT 1934_1_26",
			"-1 - WAT 1960_10_28 -1",
			"0 - GMT"
		],
		"Africa/Ouagadougou": [
			"-0:6:4 - LMT 1912 -0:6:4",
			"0 - GMT"
		],
		"Africa/Porto-Novo": [
			"0:10:28 - LMT 1912 0:10:28",
			"0 - GMT 1934_1_26",
			"1 - WAT"
		],
		"Africa/Sao_Tome": [
			"0:26:56 - LMT 1884 0:26:56",
			"-0:36:32 - LMT 1912 -0:36:32",
			"0 - GMT"
		],
		"Africa/Tripoli": [
			"0:52:44 - LMT 1920 0:52:44",
			"1 Libya CE%sT 1959 1",
			"2 - EET 1982 2",
			"1 Libya CE%sT 1990_4_4 1",
			"2 - EET 1996_8_30 2",
			"1 Libya CE%sT 1997_9_4 2",
			"2 - EET 2012_10_10_2 2",
			"1 Libya CE%sT"
		],
		"Africa/Tunis": [
			"0:40:44 - LMT 1881_4_12 0:40:44",
			"0:9:21 - PMT 1911_2_11 0:9:21",
			"1 Tunisia CE%sT"
		],
		"Africa/Windhoek": [
			"1:8:24 - LMT 1892_1_8 1:8:24",
			"1:30 - SWAT 1903_2 1:30",
			"2 - SAST 1942_8_20_2 2",
			"3 - SAST 1943_2_21_2 3",
			"2 - SAST 1990_2_21 2",
			"2 - CAT 1994_3_3 2",
			"1 Namibia WA%sT"
		],
		"America/Adak": [
			"12:13:21 - LMT 1867_9_18 12:13:21",
			"-11:46:38 - LMT 1900_7_20_12 -11:46:38",
			"-11 - NST 1942 -11",
			"-11 US N%sT 1946 -11",
			"-11 - NST 1967_3 -11",
			"-11 - BST 1969 -11",
			"-11 US B%sT 1983_9_30_2 -10",
			"-10 US AH%sT 1983_10_30 -10",
			"-10 US HA%sT"
		],
		"America/Anchorage": [
			"14:0:24 - LMT 1867_9_18 14:0:24",
			"-9:59:36 - LMT 1900_7_20_12 -9:59:36",
			"-10 - CAT 1942 -10",
			"-10 US CAT/CAWT 1945_7_14_23",
			"-10 US CAT/CAPT 1946 -10",
			"-10 - CAT 1967_3 -10",
			"-10 - AHST 1969 -10",
			"-10 US AH%sT 1983_9_30_2 -9",
			"-9 US Y%sT 1983_10_30 -9",
			"-9 US AK%sT"
		],
		"America/Anguilla": [
			"-4:12:16 - LMT 1912_2_2 -4:12:16",
			"-4 - AST"
		],
		"America/Antigua": [
			"-4:7:12 - LMT 1912_2_2 -4:7:12",
			"-5 - EST 1951 -5",
			"-4 - AST"
		],
		"America/Araguaina": [
			"-3:12:48 - LMT 1914 -3:12:48",
			"-3 Brazil BR%sT 1990_8_17 -3",
			"-3 - BRT 1995_8_14 -3",
			"-3 Brazil BR%sT 2003_8_24 -3",
			"-3 - BRT 2012_9_21 -3",
			"-3 Brazil BR%sT"
		],
		"America/Argentina/Buenos_Aires": [
			"-3:53:48 - LMT 1894_9_31 -3:53:48",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 Arg AR%sT"
		],
		"America/Argentina/Catamarca": [
			"-4:23:8 - LMT 1894_9_31 -4:23:8",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1991_2_3 -2",
			"-4 - WART 1991_9_20 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 - ART 2004_5_1 -3",
			"-4 - WART 2004_5_20 -4",
			"-3 Arg AR%sT 2008_9_18 -3",
			"-3 - ART"
		],
		"America/Argentina/Cordoba": [
			"-4:16:48 - LMT 1894_9_31 -4:16:48",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1991_2_3 -2",
			"-4 - WART 1991_9_20 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 Arg AR%sT"
		],
		"America/Argentina/Jujuy": [
			"-4:21:12 - LMT 1894_9_31 -4:21:12",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1990_2_4 -2",
			"-4 - WART 1990_9_28 -4",
			"-3 - WARST 1991_2_17 -3",
			"-4 - WART 1991_9_6 -4",
			"-2 - ARST 1992 -2",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 Arg AR%sT 2008_9_18 -3",
			"-3 - ART"
		],
		"America/Argentina/La_Rioja": [
			"-4:27:24 - LMT 1894_9_31 -4:27:24",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1991_2_1 -2",
			"-4 - WART 1991_4_7 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 - ART 2004_5_1 -3",
			"-4 - WART 2004_5_20 -4",
			"-3 Arg AR%sT 2008_9_18 -3",
			"-3 - ART"
		],
		"America/Argentina/Mendoza": [
			"-4:35:16 - LMT 1894_9_31 -4:35:16",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1990_2_4 -2",
			"-4 - WART 1990_9_15 -4",
			"-3 - WARST 1991_2_1 -3",
			"-4 - WART 1991_9_15 -4",
			"-3 - WARST 1992_2_1 -3",
			"-4 - WART 1992_9_18 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 - ART 2004_4_23 -3",
			"-4 - WART 2004_8_26 -4",
			"-3 Arg AR%sT 2008_9_18 -3",
			"-3 - ART"
		],
		"America/Argentina/Rio_Gallegos": [
			"-4:36:52 - LMT 1894_9_31 -4:36:52",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 - ART 2004_5_1 -3",
			"-4 - WART 2004_5_20 -4",
			"-3 Arg AR%sT 2008_9_18 -3",
			"-3 - ART"
		],
		"America/Argentina/Salta": [
			"-4:21:40 - LMT 1894_9_31 -4:21:40",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1991_2_3 -2",
			"-4 - WART 1991_9_20 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 Arg AR%sT 2008_9_18 -3",
			"-3 - ART"
		],
		"America/Argentina/San_Juan": [
			"-4:34:4 - LMT 1894_9_31 -4:34:4",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1991_2_1 -2",
			"-4 - WART 1991_4_7 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 - ART 2004_4_31 -3",
			"-4 - WART 2004_6_25 -4",
			"-3 Arg AR%sT 2008_9_18 -3",
			"-3 - ART"
		],
		"America/Argentina/San_Luis": [
			"-4:25:24 - LMT 1894_9_31 -4:25:24",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1990 -2",
			"-2 - ARST 1990_2_14 -2",
			"-4 - WART 1990_9_15 -4",
			"-3 - WARST 1991_2_1 -3",
			"-4 - WART 1991_5_1 -4",
			"-3 - ART 1999_9_3 -3",
			"-3 - WARST 2000_2_3 -3",
			"-3 - ART 2004_4_31 -3",
			"-4 - WART 2004_6_25 -4",
			"-3 Arg AR%sT 2008_0_21 -2",
			"-4 SanLuis WAR%sT"
		],
		"America/Argentina/Tucuman": [
			"-4:20:52 - LMT 1894_9_31 -4:20:52",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1991_2_3 -2",
			"-4 - WART 1991_9_20 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 - ART 2004_5_1 -3",
			"-4 - WART 2004_5_13 -4",
			"-3 Arg AR%sT"
		],
		"America/Argentina/Ushuaia": [
			"-4:33:12 - LMT 1894_9_31 -4:33:12",
			"-4:16:48 - CMT 1920_4 -4:16:48",
			"-4 - ART 1930_11 -4",
			"-4 Arg AR%sT 1969_9_5 -4",
			"-3 Arg AR%sT 1999_9_3 -3",
			"-4 Arg AR%sT 2000_2_3 -3",
			"-3 - ART 2004_4_30 -3",
			"-4 - WART 2004_5_20 -4",
			"-3 Arg AR%sT 2008_9_18 -3",
			"-3 - ART"
		],
		"America/Aruba": [
			"-4:40:24 - LMT 1912_1_12 -4:40:24",
			"-4:30 - ANT 1965 -4:30",
			"-4 - AST"
		],
		"America/Asuncion": [
			"-3:50:40 - LMT 1890 -3:50:40",
			"-3:50:40 - AMT 1931_9_10 -3:50:40",
			"-4 - PYT 1972_9 -4",
			"-3 - PYT 1974_3 -3",
			"-4 Para PY%sT"
		],
		"America/Atikokan": [
			"-6:6:28 - LMT 1895 -6:6:28",
			"-6 Canada C%sT 1940_8_29 -6",
			"-5 - CDT 1942_1_9_2 -6",
			"-6 Canada C%sT 1945_8_30_2 -5",
			"-5 - EST"
		],
		"America/Bahia": [
			"-2:34:4 - LMT 1914 -2:34:4",
			"-3 Brazil BR%sT 2003_8_24 -3",
			"-3 - BRT 2011_9_16 -3",
			"-3 Brazil BR%sT 2012_9_21 -3",
			"-3 - BRT"
		],
		"America/Bahia_Banderas": [
			"-7:1 - LMT 1921_11_31_23_59 -7:1",
			"-7 - MST 1927_5_10_23 -7",
			"-6 - CST 1930_10_15 -6",
			"-7 - MST 1931_4_1_23 -7",
			"-6 - CST 1931_9 -6",
			"-7 - MST 1932_3_1 -7",
			"-6 - CST 1942_3_24 -6",
			"-7 - MST 1949_0_14 -7",
			"-8 - PST 1970 -8",
			"-7 Mexico M%sT 2010_3_4_2 -7",
			"-6 Mexico C%sT"
		],
		"America/Barbados": [
			"-3:58:29 - LMT 1924 -3:58:29",
			"-3:58:29 - BMT 1932 -3:58:29",
			"-4 Barb A%sT"
		],
		"America/Belem": [
			"-3:13:56 - LMT 1914 -3:13:56",
			"-3 Brazil BR%sT 1988_8_12 -3",
			"-3 - BRT"
		],
		"America/Belize": [
			"-5:52:48 - LMT 1912_3 -5:52:48",
			"-6 Belize C%sT"
		],
		"America/Blanc-Sablon": [
			"-3:48:28 - LMT 1884 -3:48:28",
			"-4 Canada A%sT 1970 -4",
			"-4 - AST"
		],
		"America/Boa_Vista": [
			"-4:2:40 - LMT 1914 -4:2:40",
			"-4 Brazil AM%sT 1988_8_12 -4",
			"-4 - AMT 1999_8_30 -4",
			"-4 Brazil AM%sT 2000_9_15 -3",
			"-4 - AMT"
		],
		"America/Bogota": [
			"-4:56:16 - LMT 1884_2_13 -4:56:16",
			"-4:56:16 - BMT 1914_10_23 -4:56:16",
			"-5 CO CO%sT"
		],
		"America/Boise": [
			"-7:44:49 - LMT 1883_10_18_12_15_11 -7:44:49",
			"-8 US P%sT 1923_4_13_2 -8",
			"-7 US M%sT 1974 -7",
			"-7 - MST 1974_1_3_2 -7",
			"-7 US M%sT"
		],
		"America/Cambridge_Bay": [
			"0 - zzz 1920",
			"-7 NT_YK M%sT 1999_9_31_2 -6",
			"-6 Canada C%sT 2000_9_29_2 -5",
			"-5 - EST 2000_10_5_0 -5",
			"-6 - CST 2001_3_1_3 -6",
			"-7 Canada M%sT"
		],
		"America/Campo_Grande": [
			"-3:38:28 - LMT 1914 -3:38:28",
			"-4 Brazil AM%sT"
		],
		"America/Cancun": [
			"-5:47:4 - LMT 1922_0_1_0_12_56 -5:47:4",
			"-6 - CST 1981_11_23 -6",
			"-5 Mexico E%sT 1998_7_2_2 -4",
			"-6 Mexico C%sT"
		],
		"America/Caracas": [
			"-4:27:44 - LMT 1890 -4:27:44",
			"-4:27:40 - CMT 1912_1_12 -4:27:40",
			"-4:30 - VET 1965 -4:30",
			"-4 - VET 2007_11_9_03 -4",
			"-4:30 - VET"
		],
		"America/Cayenne": [
			"-3:29:20 - LMT 1911_6 -3:29:20",
			"-4 - GFT 1967_9 -4",
			"-3 - GFT"
		],
		"America/Cayman": [
			"-5:25:32 - LMT 1890 -5:25:32",
			"-5:7:12 - KMT 1912_1 -5:7:12",
			"-5 - EST"
		],
		"America/Chicago": [
			"-5:50:36 - LMT 1883_10_18_12_9_24 -5:50:36",
			"-6 US C%sT 1920 -6",
			"-6 Chicago C%sT 1936_2_1_2 -6",
			"-5 - EST 1936_10_15_2 -5",
			"-6 Chicago C%sT 1942 -6",
			"-6 US C%sT 1946 -6",
			"-6 Chicago C%sT 1967 -6",
			"-6 US C%sT"
		],
		"America/Chihuahua": [
			"-7:4:20 - LMT 1921_11_31_23_55_40 -7:4:20",
			"-7 - MST 1927_5_10_23 -7",
			"-6 - CST 1930_10_15 -6",
			"-7 - MST 1931_4_1_23 -7",
			"-6 - CST 1931_9 -6",
			"-7 - MST 1932_3_1 -7",
			"-6 - CST 1996 -6",
			"-6 Mexico C%sT 1998 -6",
			"-6 - CST 1998_3_5_3 -6",
			"-7 Mexico M%sT"
		],
		"America/Costa_Rica": [
			"-5:36:13 - LMT 1890 -5:36:13",
			"-5:36:13 - SJMT 1921_0_15 -5:36:13",
			"-6 CR C%sT"
		],
		"America/Creston": [
			"-7:46:4 - LMT 1884 -7:46:4",
			"-7 - MST 1916_9_1 -7",
			"-8 - PST 1918_5_2 -8",
			"-7 - MST"
		],
		"America/Cuiaba": [
			"-3:44:20 - LMT 1914 -3:44:20",
			"-4 Brazil AM%sT 2003_8_24 -4",
			"-4 - AMT 2004_9_1 -4",
			"-4 Brazil AM%sT"
		],
		"America/Curacao": [
			"-4:35:47 - LMT 1912_1_12 -4:35:47",
			"-4:30 - ANT 1965 -4:30",
			"-4 - AST"
		],
		"America/Danmarkshavn": [
			"-1:14:40 - LMT 1916_6_28 -1:14:40",
			"-3 - WGT 1980_3_6_2 -3",
			"-3 EU WG%sT 1996 -3",
			"0 - GMT"
		],
		"America/Dawson": [
			"-9:17:40 - LMT 1900_7_20 -9:17:40",
			"-9 NT_YK Y%sT 1973_9_28_0 -9",
			"-8 NT_YK P%sT 1980 -8",
			"-8 Canada P%sT"
		],
		"America/Dawson_Creek": [
			"-8:0:56 - LMT 1884 -8:0:56",
			"-8 Canada P%sT 1947 -8",
			"-8 Vanc P%sT 1972_7_30_2 -7",
			"-7 - MST"
		],
		"America/Denver": [
			"-6:59:56 - LMT 1883_10_18_12_0_4 -6:59:56",
			"-7 US M%sT 1920 -7",
			"-7 Denver M%sT 1942 -7",
			"-7 US M%sT 1946 -7",
			"-7 Denver M%sT 1967 -7",
			"-7 US M%sT"
		],
		"America/Detroit": [
			"-5:32:11 - LMT 1905 -5:32:11",
			"-6 - CST 1915_4_15_2 -6",
			"-5 - EST 1942 -5",
			"-5 US E%sT 1946 -5",
			"-5 Detroit E%sT 1973 -5",
			"-5 US E%sT 1975 -5",
			"-5 - EST 1975_3_27_2 -5",
			"-5 US E%sT"
		],
		"America/Dominica": [
			"-4:5:36 - LMT 1911_6_1_0_1 -4:5:36",
			"-4 - AST"
		],
		"America/Edmonton": [
			"-7:33:52 - LMT 1906_8 -7:33:52",
			"-7 Edm M%sT 1987 -7",
			"-7 Canada M%sT"
		],
		"America/Eirunepe": [
			"-4:39:28 - LMT 1914 -4:39:28",
			"-5 Brazil AC%sT 1988_8_12 -5",
			"-5 - ACT 1993_8_28 -5",
			"-5 Brazil AC%sT 1994_8_22 -5",
			"-5 - ACT 2008_5_24_00 -5",
			"-4 - AMT"
		],
		"America/El_Salvador": [
			"-5:56:48 - LMT 1921 -5:56:48",
			"-6 Salv C%sT"
		],
		"America/Fortaleza": [
			"-2:34 - LMT 1914 -2:34",
			"-3 Brazil BR%sT 1990_8_17 -3",
			"-3 - BRT 1999_8_30 -3",
			"-3 Brazil BR%sT 2000_9_22 -2",
			"-3 - BRT 2001_8_13 -3",
			"-3 Brazil BR%sT 2002_9_1 -3",
			"-3 - BRT"
		],
		"America/Glace_Bay": [
			"-3:59:48 - LMT 1902_5_15 -3:59:48",
			"-4 Canada A%sT 1953 -4",
			"-4 Halifax A%sT 1954 -4",
			"-4 - AST 1972 -4",
			"-4 Halifax A%sT 1974 -4",
			"-4 Canada A%sT"
		],
		"America/Godthab": [
			"-3:26:56 - LMT 1916_6_28 -3:26:56",
			"-3 - WGT 1980_3_6_2 -3",
			"-3 EU WG%sT"
		],
		"America/Goose_Bay": [
			"-4:1:40 - LMT 1884 -4:1:40",
			"-3:30:52 - NST 1918 -3:30:52",
			"-3:30:52 Canada N%sT 1919 -3:30:52",
			"-3:30:52 - NST 1935_2_30 -3:30:52",
			"-3:30 - NST 1936 -3:30",
			"-3:30 StJohns N%sT 1942_4_11 -3:30",
			"-3:30 Canada N%sT 1946 -3:30",
			"-3:30 StJohns N%sT 1966_2_15_2 -3:30",
			"-4 StJohns A%sT 2011_10 -3",
			"-4 Canada A%sT"
		],
		"America/Grand_Turk": [
			"-4:44:32 - LMT 1890 -4:44:32",
			"-5:7:12 - KMT 1912_1 -5:7:12",
			"-5 TC E%sT"
		],
		"America/Grenada": [
			"-4:7 - LMT 1911_6 -4:7",
			"-4 - AST"
		],
		"America/Guadeloupe": [
			"-4:6:8 - LMT 1911_5_8 -4:6:8",
			"-4 - AST"
		],
		"America/Guatemala": [
			"-6:2:4 - LMT 1918_9_5 -6:2:4",
			"-6 Guat C%sT"
		],
		"America/Guayaquil": [
			"-5:19:20 - LMT 1890 -5:19:20",
			"-5:14 - QMT 1931 -5:14",
			"-5 - ECT"
		],
		"America/Guyana": [
			"-3:52:40 - LMT 1915_2 -3:52:40",
			"-3:45 - GBGT 1966_4_26 -3:45",
			"-3:45 - GYT 1975_6_31 -3:45",
			"-3 - GYT 1991 -3",
			"-4 - GYT"
		],
		"America/Halifax": [
			"-4:14:24 - LMT 1902_5_15 -4:14:24",
			"-4 Halifax A%sT 1918 -4",
			"-4 Canada A%sT 1919 -4",
			"-4 Halifax A%sT 1942_1_9_2 -4",
			"-4 Canada A%sT 1946 -4",
			"-4 Halifax A%sT 1974 -4",
			"-4 Canada A%sT"
		],
		"America/Havana": [
			"-5:29:28 - LMT 1890 -5:29:28",
			"-5:29:36 - HMT 1925_6_19_12 -5:29:36",
			"-5 Cuba C%sT"
		],
		"America/Hermosillo": [
			"-7:23:52 - LMT 1921_11_31_23_36_8 -7:23:52",
			"-7 - MST 1927_5_10_23 -7",
			"-6 - CST 1930_10_15 -6",
			"-7 - MST 1931_4_1_23 -7",
			"-6 - CST 1931_9 -6",
			"-7 - MST 1932_3_1 -7",
			"-6 - CST 1942_3_24 -6",
			"-7 - MST 1949_0_14 -7",
			"-8 - PST 1970 -8",
			"-7 Mexico M%sT 1999 -7",
			"-7 - MST"
		],
		"America/Indiana/Indianapolis": [
			"-5:44:38 - LMT 1883_10_18_12_15_22 -5:44:38",
			"-6 US C%sT 1920 -6",
			"-6 Indianapolis C%sT 1942 -6",
			"-6 US C%sT 1946 -6",
			"-6 Indianapolis C%sT 1955_3_24_2 -6",
			"-5 - EST 1957_8_29_2 -5",
			"-6 - CST 1958_3_27_2 -6",
			"-5 - EST 1969 -5",
			"-5 US E%sT 1971 -5",
			"-5 - EST 2006 -5",
			"-5 US E%sT"
		],
		"America/Indiana/Knox": [
			"-5:46:30 - LMT 1883_10_18_12_13_30 -5:46:30",
			"-6 US C%sT 1947 -6",
			"-6 Starke C%sT 1962_3_29_2 -6",
			"-5 - EST 1963_9_27_2 -5",
			"-6 US C%sT 1991_9_27_2 -5",
			"-5 - EST 2006_3_2_2 -5",
			"-6 US C%sT"
		],
		"America/Indiana/Marengo": [
			"-5:45:23 - LMT 1883_10_18_12_14_37 -5:45:23",
			"-6 US C%sT 1951 -6",
			"-6 Marengo C%sT 1961_3_30_2 -6",
			"-5 - EST 1969 -5",
			"-5 US E%sT 1974_0_6_2 -5",
			"-5 - CDT 1974_9_27_2 -5",
			"-5 US E%sT 1976 -5",
			"-5 - EST 2006 -5",
			"-5 US E%sT"
		],
		"America/Indiana/Petersburg": [
			"-5:49:7 - LMT 1883_10_18_12_10_53 -5:49:7",
			"-6 US C%sT 1955 -6",
			"-6 Pike C%sT 1965_3_25_2 -6",
			"-5 - EST 1966_9_30_2 -5",
			"-6 US C%sT 1977_9_30_2 -5",
			"-5 - EST 2006_3_2_2 -5",
			"-6 US C%sT 2007_10_4_2 -5",
			"-5 US E%sT"
		],
		"America/Indiana/Tell_City": [
			"-5:47:3 - LMT 1883_10_18_12_12_57 -5:47:3",
			"-6 US C%sT 1946 -6",
			"-6 Perry C%sT 1964_3_26_2 -6",
			"-5 - EST 1969 -5",
			"-5 US E%sT 1971 -5",
			"-5 - EST 2006_3_2_2 -5",
			"-6 US C%sT"
		],
		"America/Indiana/Vevay": [
			"-5:40:16 - LMT 1883_10_18_12_19_44 -5:40:16",
			"-6 US C%sT 1954_3_25_2 -6",
			"-5 - EST 1969 -5",
			"-5 US E%sT 1973 -5",
			"-5 - EST 2006 -5",
			"-5 US E%sT"
		],
		"America/Indiana/Vincennes": [
			"-5:50:7 - LMT 1883_10_18_12_9_53 -5:50:7",
			"-6 US C%sT 1946 -6",
			"-6 Vincennes C%sT 1964_3_26_2 -6",
			"-5 - EST 1969 -5",
			"-5 US E%sT 1971 -5",
			"-5 - EST 2006_3_2_2 -5",
			"-6 US C%sT 2007_10_4_2 -5",
			"-5 US E%sT"
		],
		"America/Indiana/Winamac": [
			"-5:46:25 - LMT 1883_10_18_12_13_35 -5:46:25",
			"-6 US C%sT 1946 -6",
			"-6 Pulaski C%sT 1961_3_30_2 -6",
			"-5 - EST 1969 -5",
			"-5 US E%sT 1971 -5",
			"-5 - EST 2006_3_2_2 -5",
			"-6 US C%sT 2007_2_11_2 -6",
			"-5 US E%sT"
		],
		"America/Inuvik": [
			"0 - zzz 1953",
			"-8 NT_YK P%sT 1979_3_29_2 -8",
			"-7 NT_YK M%sT 1980 -7",
			"-7 Canada M%sT"
		],
		"America/Iqaluit": [
			"0 - zzz 1942_7",
			"-5 NT_YK E%sT 1999_9_31_2 -4",
			"-6 Canada C%sT 2000_9_29_2 -5",
			"-5 Canada E%sT"
		],
		"America/Jamaica": [
			"-5:7:12 - LMT 1890 -5:7:12",
			"-5:7:12 - KMT 1912_1 -5:7:12",
			"-5 - EST 1974_3_28_2 -5",
			"-5 US E%sT 1984 -5",
			"-5 - EST"
		],
		"America/Juneau": [
			"15:2:19 - LMT 1867_9_18 15:2:19",
			"-8:57:41 - LMT 1900_7_20_12 -8:57:41",
			"-8 - PST 1942 -8",
			"-8 US P%sT 1946 -8",
			"-8 - PST 1969 -8",
			"-8 US P%sT 1980_3_27_2 -8",
			"-9 US Y%sT 1980_9_26_2 -8",
			"-8 US P%sT 1983_9_30_2 -7",
			"-9 US Y%sT 1983_10_30 -9",
			"-9 US AK%sT"
		],
		"America/Kentucky/Louisville": [
			"-5:43:2 - LMT 1883_10_18_12_16_58 -5:43:2",
			"-6 US C%sT 1921 -6",
			"-6 Louisville C%sT 1942 -6",
			"-6 US C%sT 1946 -6",
			"-6 Louisville C%sT 1961_6_23_2 -5",
			"-5 - EST 1968 -5",
			"-5 US E%sT 1974_0_6_2 -5",
			"-5 - CDT 1974_9_27_2 -5",
			"-5 US E%sT"
		],
		"America/Kentucky/Monticello": [
			"-5:39:24 - LMT 1883_10_18_12_20_36 -5:39:24",
			"-6 US C%sT 1946 -6",
			"-6 - CST 1968 -6",
			"-6 US C%sT 2000_9_29_2 -5",
			"-5 US E%sT"
		],
		"America/La_Paz": [
			"-4:32:36 - LMT 1890 -4:32:36",
			"-4:32:36 - CMT 1931_9_15 -4:32:36",
			"-3:32:36 - BOST 1932_2_21 -3:32:36",
			"-4 - BOT"
		],
		"America/Lima": [
			"-5:8:12 - LMT 1890 -5:8:12",
			"-5:8:36 - LMT 1908_6_28 -5:8:36",
			"-5 Peru PE%sT"
		],
		"America/Los_Angeles": [
			"-7:52:58 - LMT 1883_10_18_12_7_2 -7:52:58",
			"-8 US P%sT 1946 -8",
			"-8 CA P%sT 1967 -8",
			"-8 US P%sT"
		],
		"America/Maceio": [
			"-2:22:52 - LMT 1914 -2:22:52",
			"-3 Brazil BR%sT 1990_8_17 -3",
			"-3 - BRT 1995_9_13 -3",
			"-3 Brazil BR%sT 1996_8_4 -3",
			"-3 - BRT 1999_8_30 -3",
			"-3 Brazil BR%sT 2000_9_22 -2",
			"-3 - BRT 2001_8_13 -3",
			"-3 Brazil BR%sT 2002_9_1 -3",
			"-3 - BRT"
		],
		"America/Managua": [
			"-5:45:8 - LMT 1890 -5:45:8",
			"-5:45:12 - MMT 1934_5_23 -5:45:12",
			"-6 - CST 1973_4 -6",
			"-5 - EST 1975_1_16 -5",
			"-6 Nic C%sT 1992_0_1_4 -6",
			"-5 - EST 1992_8_24 -5",
			"-6 - CST 1993 -6",
			"-5 - EST 1997 -5",
			"-6 Nic C%sT"
		],
		"America/Manaus": [
			"-4:0:4 - LMT 1914 -4:0:4",
			"-4 Brazil AM%sT 1988_8_12 -4",
			"-4 - AMT 1993_8_28 -4",
			"-4 Brazil AM%sT 1994_8_22 -4",
			"-4 - AMT"
		],
		"America/Martinique": [
			"-4:4:20 - LMT 1890 -4:4:20",
			"-4:4:20 - FFMT 1911_4 -4:4:20",
			"-4 - AST 1980_3_6 -4",
			"-3 - ADT 1980_8_28 -3",
			"-4 - AST"
		],
		"America/Matamoros": [
			"-6:40 - LMT 1921_11_31_23_20 -6:40",
			"-6 - CST 1988 -6",
			"-6 US C%sT 1989 -6",
			"-6 Mexico C%sT 2010 -6",
			"-6 US C%sT"
		],
		"America/Mazatlan": [
			"-7:5:40 - LMT 1921_11_31_23_54_20 -7:5:40",
			"-7 - MST 1927_5_10_23 -7",
			"-6 - CST 1930_10_15 -6",
			"-7 - MST 1931_4_1_23 -7",
			"-6 - CST 1931_9 -6",
			"-7 - MST 1932_3_1 -7",
			"-6 - CST 1942_3_24 -6",
			"-7 - MST 1949_0_14 -7",
			"-8 - PST 1970 -8",
			"-7 Mexico M%sT"
		],
		"America/Menominee": [
			"-5:50:27 - LMT 1885_8_18_12 -5:50:27",
			"-6 US C%sT 1946 -6",
			"-6 Menominee C%sT 1969_3_27_2 -6",
			"-5 - EST 1973_3_29_2 -5",
			"-6 US C%sT"
		],
		"America/Merida": [
			"-5:58:28 - LMT 1922_0_1_0_1_32 -5:58:28",
			"-6 - CST 1981_11_23 -6",
			"-5 - EST 1982_11_2 -5",
			"-6 Mexico C%sT"
		],
		"America/Metlakatla": [
			"15:13:42 - LMT 1867_9_18 15:13:42",
			"-8:46:18 - LMT 1900_7_20_12 -8:46:18",
			"-8 - PST 1942 -8",
			"-8 US P%sT 1946 -8",
			"-8 - PST 1969 -8",
			"-8 US P%sT 1983_9_30_2 -7",
			"-8 - MeST"
		],
		"America/Mexico_City": [
			"-6:36:36 - LMT 1922_0_1_0_23_24 -6:36:36",
			"-7 - MST 1927_5_10_23 -7",
			"-6 - CST 1930_10_15 -6",
			"-7 - MST 1931_4_1_23 -7",
			"-6 - CST 1931_9 -6",
			"-7 - MST 1932_3_1 -7",
			"-6 Mexico C%sT 2001_8_30_02 -5",
			"-6 - CST 2002_1_20 -6",
			"-6 Mexico C%sT"
		],
		"America/Miquelon": [
			"-3:44:40 - LMT 1911_4_15 -3:44:40",
			"-4 - AST 1980_4 -4",
			"-3 - PMST 1987 -3",
			"-3 Canada PM%sT"
		],
		"America/Moncton": [
			"-4:19:8 - LMT 1883_11_9 -4:19:8",
			"-5 - EST 1902_5_15 -5",
			"-4 Canada A%sT 1933 -4",
			"-4 Moncton A%sT 1942 -4",
			"-4 Canada A%sT 1946 -4",
			"-4 Moncton A%sT 1973 -4",
			"-4 Canada A%sT 1993 -4",
			"-4 Moncton A%sT 2007 -4",
			"-4 Canada A%sT"
		],
		"America/Monterrey": [
			"-6:41:16 - LMT 1921_11_31_23_18_44 -6:41:16",
			"-6 - CST 1988 -6",
			"-6 US C%sT 1989 -6",
			"-6 Mexico C%sT"
		],
		"America/Montevideo": [
			"-3:44:44 - LMT 1898_5_28 -3:44:44",
			"-3:44:44 - MMT 1920_4_1 -3:44:44",
			"-3:30 Uruguay UY%sT 1942_11_14 -3:30",
			"-3 Uruguay UY%sT"
		],
		"America/Montreal": [
			"-4:54:16 - LMT 1884 -4:54:16",
			"-5 Mont E%sT 1918 -5",
			"-5 Canada E%sT 1919 -5",
			"-5 Mont E%sT 1942_1_9_2 -5",
			"-5 Canada E%sT 1946 -5",
			"-5 Mont E%sT 1974 -5",
			"-5 Canada E%sT"
		],
		"America/Montserrat": [
			"-4:8:52 - LMT 1911_6_1_0_1 -4:8:52",
			"-4 - AST"
		],
		"America/Nassau": [
			"-5:9:30 - LMT 1912_2_2 -5:9:30",
			"-5 Bahamas E%sT 1976 -5",
			"-5 US E%sT"
		],
		"America/New_York": [
			"-4:56:2 - LMT 1883_10_18_12_3_58 -4:56:2",
			"-5 US E%sT 1920 -5",
			"-5 NYC E%sT 1942 -5",
			"-5 US E%sT 1946 -5",
			"-5 NYC E%sT 1967 -5",
			"-5 US E%sT"
		],
		"America/Nipigon": [
			"-5:53:4 - LMT 1895 -5:53:4",
			"-5 Canada E%sT 1940_8_29 -5",
			"-4 - EDT 1942_1_9_2 -5",
			"-5 Canada E%sT"
		],
		"America/Nome": [
			"12:58:21 - LMT 1867_9_18 12:58:21",
			"-11:1:38 - LMT 1900_7_20_12 -11:1:38",
			"-11 - NST 1942 -11",
			"-11 US N%sT 1946 -11",
			"-11 - NST 1967_3 -11",
			"-11 - BST 1969 -11",
			"-11 US B%sT 1983_9_30_2 -10",
			"-9 US Y%sT 1983_10_30 -9",
			"-9 US AK%sT"
		],
		"America/Noronha": [
			"-2:9:40 - LMT 1914 -2:9:40",
			"-2 Brazil FN%sT 1990_8_17 -2",
			"-2 - FNT 1999_8_30 -2",
			"-2 Brazil FN%sT 2000_9_15 -1",
			"-2 - FNT 2001_8_13 -2",
			"-2 Brazil FN%sT 2002_9_1 -2",
			"-2 - FNT"
		],
		"America/North_Dakota/Beulah": [
			"-6:47:7 - LMT 1883_10_18_12_12_53 -6:47:7",
			"-7 US M%sT 2010_10_7_2 -6",
			"-6 US C%sT"
		],
		"America/North_Dakota/Center": [
			"-6:45:12 - LMT 1883_10_18_12_14_48 -6:45:12",
			"-7 US M%sT 1992_9_25_02 -6",
			"-6 US C%sT"
		],
		"America/North_Dakota/New_Salem": [
			"-6:45:39 - LMT 1883_10_18_12_14_21 -6:45:39",
			"-7 US M%sT 2003_9_26_02 -6",
			"-6 US C%sT"
		],
		"America/Ojinaga": [
			"-6:57:40 - LMT 1922_0_1_0_2_20 -6:57:40",
			"-7 - MST 1927_5_10_23 -7",
			"-6 - CST 1930_10_15 -6",
			"-7 - MST 1931_4_1_23 -7",
			"-6 - CST 1931_9 -6",
			"-7 - MST 1932_3_1 -7",
			"-6 - CST 1996 -6",
			"-6 Mexico C%sT 1998 -6",
			"-6 - CST 1998_3_5_3 -6",
			"-7 Mexico M%sT 2010 -7",
			"-7 US M%sT"
		],
		"America/Panama": [
			"-5:18:8 - LMT 1890 -5:18:8",
			"-5:19:36 - CMT 1908_3_22 -5:19:36",
			"-5 - EST"
		],
		"America/Pangnirtung": [
			"0 - zzz 1921",
			"-4 NT_YK A%sT 1995_3_2_2 -4",
			"-5 Canada E%sT 1999_9_31_2 -4",
			"-6 Canada C%sT 2000_9_29_2 -5",
			"-5 Canada E%sT"
		],
		"America/Paramaribo": [
			"-3:40:40 - LMT 1911 -3:40:40",
			"-3:40:52 - PMT 1935 -3:40:52",
			"-3:40:36 - PMT 1945_9 -3:40:36",
			"-3:30 - NEGT 1975_10_20 -3:30",
			"-3:30 - SRT 1984_9 -3:30",
			"-3 - SRT"
		],
		"America/Phoenix": [
			"-7:28:18 - LMT 1883_10_18_11_31_42 -7:28:18",
			"-7 US M%sT 1944_0_1_00_1 -6",
			"-7 - MST 1944_3_1_00_1 -7",
			"-7 US M%sT 1944_9_1_00_1 -6",
			"-7 - MST 1967 -7",
			"-7 US M%sT 1968_2_21 -7",
			"-7 - MST"
		],
		"America/Port-au-Prince": [
			"-4:49:20 - LMT 1890 -4:49:20",
			"-4:49 - PPMT 1917_0_24_12 -4:49",
			"-5 Haiti E%sT"
		],
		"America/Port_of_Spain": [
			"-4:6:4 - LMT 1912_2_2 -4:6:4",
			"-4 - AST"
		],
		"America/Porto_Velho": [
			"-4:15:36 - LMT 1914 -4:15:36",
			"-4 Brazil AM%sT 1988_8_12 -4",
			"-4 - AMT"
		],
		"America/Puerto_Rico": [
			"-4:24:25 - LMT 1899_2_28_12 -4:24:25",
			"-4 - AST 1942_4_3 -4",
			"-4 US A%sT 1946 -4",
			"-4 - AST"
		],
		"America/Rainy_River": [
			"-6:18:16 - LMT 1895 -6:18:16",
			"-6 Canada C%sT 1940_8_29 -6",
			"-5 - CDT 1942_1_9_2 -6",
			"-6 Canada C%sT"
		],
		"America/Rankin_Inlet": [
			"0 - zzz 1957",
			"-6 NT_YK C%sT 2000_9_29_2 -5",
			"-5 - EST 2001_3_1_3 -5",
			"-6 Canada C%sT"
		],
		"America/Recife": [
			"-2:19:36 - LMT 1914 -2:19:36",
			"-3 Brazil BR%sT 1990_8_17 -3",
			"-3 - BRT 1999_8_30 -3",
			"-3 Brazil BR%sT 2000_9_15 -2",
			"-3 - BRT 2001_8_13 -3",
			"-3 Brazil BR%sT 2002_9_1 -3",
			"-3 - BRT"
		],
		"America/Regina": [
			"-6:58:36 - LMT 1905_8 -6:58:36",
			"-7 Regina M%sT 1960_3_24_2 -7",
			"-6 - CST"
		],
		"America/Resolute": [
			"0 - zzz 1947_7_31",
			"-6 NT_YK C%sT 2000_9_29_2 -5",
			"-5 - EST 2001_3_1_3 -5",
			"-6 Canada C%sT 2006_9_29_2 -5",
			"-5 - EST 2007_2_11_3 -5",
			"-6 Canada C%sT"
		],
		"America/Rio_Branco": [
			"-4:31:12 - LMT 1914 -4:31:12",
			"-5 Brazil AC%sT 1988_8_12 -5",
			"-5 - ACT 2008_5_24_00 -5",
			"-4 - AMT"
		],
		"America/Santa_Isabel": [
			"-7:39:28 - LMT 1922_0_1_0_20_32 -7:39:28",
			"-7 - MST 1924 -7",
			"-8 - PST 1927_5_10_23 -8",
			"-7 - MST 1930_10_15 -7",
			"-8 - PST 1931_3_1 -8",
			"-7 - PDT 1931_8_30 -7",
			"-8 - PST 1942_3_24 -8",
			"-7 - PWT 1945_7_14_23",
			"-7 - PPT 1945_10_12 -7",
			"-8 - PST 1948_3_5 -8",
			"-7 - PDT 1949_0_14 -7",
			"-8 - PST 1954 -8",
			"-8 CA P%sT 1961 -8",
			"-8 - PST 1976 -8",
			"-8 US P%sT 1996 -8",
			"-8 Mexico P%sT 2001 -8",
			"-8 US P%sT 2002_1_20 -8",
			"-8 Mexico P%sT"
		],
		"America/Santarem": [
			"-3:38:48 - LMT 1914 -3:38:48",
			"-4 Brazil AM%sT 1988_8_12 -4",
			"-4 - AMT 2008_5_24_00 -4",
			"-3 - BRT"
		],
		"America/Santiago": [
			"-4:42:46 - LMT 1890 -4:42:46",
			"-4:42:46 - SMT 1910 -4:42:46",
			"-5 - CLT 1916_6_1 -5",
			"-4:42:46 - SMT 1918_8_1 -4:42:46",
			"-4 - CLT 1919_6_1 -4",
			"-4:42:46 - SMT 1927_8_1 -4:42:46",
			"-5 Chile CL%sT 1947_4_22 -5",
			"-4 Chile CL%sT"
		],
		"America/Santo_Domingo": [
			"-4:39:36 - LMT 1890 -4:39:36",
			"-4:40 - SDMT 1933_3_1_12 -4:40",
			"-5 DR E%sT 1974_9_27 -5",
			"-4 - AST 2000_9_29_02 -4",
			"-5 US E%sT 2000_11_3_01 -5",
			"-4 - AST"
		],
		"America/Sao_Paulo": [
			"-3:6:28 - LMT 1914 -3:6:28",
			"-3 Brazil BR%sT 1963_9_23_00 -3",
			"-2 - BRST 1964 -2",
			"-3 Brazil BR%sT"
		],
		"America/Scoresbysund": [
			"-1:27:52 - LMT 1916_6_28 -1:27:52",
			"-2 - CGT 1980_3_6_2 -2",
			"-2 C-Eur CG%sT 1981_2_29 -2",
			"-1 EU EG%sT"
		],
		"America/Sitka": [
			"14:58:47 - LMT 1867_9_18 14:58:47",
			"-9:1:13 - LMT 1900_7_20_12 -9:1:13",
			"-8 - PST 1942 -8",
			"-8 US P%sT 1946 -8",
			"-8 - PST 1969 -8",
			"-8 US P%sT 1983_9_30_2 -7",
			"-9 US Y%sT 1983_10_30 -9",
			"-9 US AK%sT"
		],
		"America/St_Johns": [
			"-3:30:52 - LMT 1884 -3:30:52",
			"-3:30:52 StJohns N%sT 1918 -3:30:52",
			"-3:30:52 Canada N%sT 1919 -3:30:52",
			"-3:30:52 StJohns N%sT 1935_2_30 -3:30:52",
			"-3:30 StJohns N%sT 1942_4_11 -3:30",
			"-3:30 Canada N%sT 1946 -3:30",
			"-3:30 StJohns N%sT 2011_10 -2:30",
			"-3:30 Canada N%sT"
		],
		"America/St_Kitts": [
			"-4:10:52 - LMT 1912_2_2 -4:10:52",
			"-4 - AST"
		],
		"America/St_Lucia": [
			"-4:4 - LMT 1890 -4:4",
			"-4:4 - CMT 1912 -4:4",
			"-4 - AST"
		],
		"America/St_Thomas": [
			"-4:19:44 - LMT 1911_6 -4:19:44",
			"-4 - AST"
		],
		"America/St_Vincent": [
			"-4:4:56 - LMT 1890 -4:4:56",
			"-4:4:56 - KMT 1912 -4:4:56",
			"-4 - AST"
		],
		"America/Swift_Current": [
			"-7:11:20 - LMT 1905_8 -7:11:20",
			"-7 Canada M%sT 1946_3_28_2 -7",
			"-7 Regina M%sT 1950 -7",
			"-7 Swift M%sT 1972_3_30_2 -7",
			"-6 - CST"
		],
		"America/Tegucigalpa": [
			"-5:48:52 - LMT 1921_3 -5:48:52",
			"-6 Hond C%sT"
		],
		"America/Thule": [
			"-4:35:8 - LMT 1916_6_28 -4:35:8",
			"-4 Thule A%sT"
		],
		"America/Thunder_Bay": [
			"-5:57 - LMT 1895 -5:57",
			"-6 - CST 1910 -6",
			"-5 - EST 1942 -5",
			"-5 Canada E%sT 1970 -5",
			"-5 Mont E%sT 1973 -5",
			"-5 - EST 1974 -5",
			"-5 Canada E%sT"
		],
		"America/Tijuana": [
			"-7:48:4 - LMT 1922_0_1_0_11_56 -7:48:4",
			"-7 - MST 1924 -7",
			"-8 - PST 1927_5_10_23 -8",
			"-7 - MST 1930_10_15 -7",
			"-8 - PST 1931_3_1 -8",
			"-7 - PDT 1931_8_30 -7",
			"-8 - PST 1942_3_24 -8",
			"-7 - PWT 1945_7_14_23",
			"-7 - PPT 1945_10_12 -7",
			"-8 - PST 1948_3_5 -8",
			"-7 - PDT 1949_0_14 -7",
			"-8 - PST 1954 -8",
			"-8 CA P%sT 1961 -8",
			"-8 - PST 1976 -8",
			"-8 US P%sT 1996 -8",
			"-8 Mexico P%sT 2001 -8",
			"-8 US P%sT 2002_1_20 -8",
			"-8 Mexico P%sT 2010 -8",
			"-8 US P%sT"
		],
		"America/Toronto": [
			"-5:17:32 - LMT 1895 -5:17:32",
			"-5 Canada E%sT 1919 -5",
			"-5 Toronto E%sT 1942_1_9_2 -5",
			"-5 Canada E%sT 1946 -5",
			"-5 Toronto E%sT 1974 -5",
			"-5 Canada E%sT"
		],
		"America/Tortola": [
			"-4:18:28 - LMT 1911_6 -4:18:28",
			"-4 - AST"
		],
		"America/Vancouver": [
			"-8:12:28 - LMT 1884 -8:12:28",
			"-8 Vanc P%sT 1987 -8",
			"-8 Canada P%sT"
		],
		"America/Whitehorse": [
			"-9:0:12 - LMT 1900_7_20 -9:0:12",
			"-9 NT_YK Y%sT 1966_6_1_2 -9",
			"-8 NT_YK P%sT 1980 -8",
			"-8 Canada P%sT"
		],
		"America/Winnipeg": [
			"-6:28:36 - LMT 1887_6_16 -6:28:36",
			"-6 Winn C%sT 2006 -6",
			"-6 Canada C%sT"
		],
		"America/Yakutat": [
			"14:41:5 - LMT 1867_9_18 14:41:5",
			"-9:18:55 - LMT 1900_7_20_12 -9:18:55",
			"-9 - YST 1942 -9",
			"-9 US Y%sT 1946 -9",
			"-9 - YST 1969 -9",
			"-9 US Y%sT 1983_10_30 -9",
			"-9 US AK%sT"
		],
		"America/Yellowknife": [
			"0 - zzz 1935",
			"-7 NT_YK M%sT 1980 -7",
			"-7 Canada M%sT"
		],
		"Antarctica/Casey": [
			"0 - zzz 1969",
			"8 - WST 2009_9_18_2 8",
			"11 - CAST 2010_2_5_2 11",
			"8 - WST 2011_9_28_2 8",
			"11 - CAST 2012_1_21_17",
			"8 - WST"
		],
		"Antarctica/Davis": [
			"0 - zzz 1957_0_13",
			"7 - DAVT 1964_10 7",
			"0 - zzz 1969_1",
			"7 - DAVT 2009_9_18_2 7",
			"5 - DAVT 2010_2_10_20",
			"7 - DAVT 2011_9_28_2 7",
			"5 - DAVT 2012_1_21_20",
			"7 - DAVT"
		],
		"Antarctica/DumontDUrville": [
			"0 - zzz 1947",
			"10 - PMT 1952_0_14 10",
			"0 - zzz 1956_10",
			"10 - DDUT"
		],
		"Antarctica/Macquarie": [
			"0 - zzz 1899_10",
			"10 - EST 1916_9_1_2 10",
			"11 - EST 1917_1 11",
			"10 Aus EST 1919_3 10",
			"0 - zzz 1948_2_25",
			"10 Aus EST 1967 10",
			"10 AT EST 2010_3_4_3 11",
			"11 - MIST"
		],
		"Antarctica/Mawson": [
			"0 - zzz 1954_1_13",
			"6 - MAWT 2009_9_18_2 6",
			"5 - MAWT"
		],
		"Antarctica/McMurdo": [
			"0 - zzz 1956",
			"12 NZAQ NZ%sT"
		],
		"Antarctica/Palmer": [
			"0 - zzz 1965",
			"-4 ArgAQ AR%sT 1969_9_5 -4",
			"-3 ArgAQ AR%sT 1982_4 -3",
			"-4 ChileAQ CL%sT"
		],
		"Antarctica/Rothera": [
			"0 - zzz 1976_11_1",
			"-3 - ROTT"
		],
		"Antarctica/Syowa": [
			"0 - zzz 1957_0_29",
			"3 - SYOT"
		],
		"Antarctica/Vostok": [
			"0 - zzz 1957_11_16",
			"6 - VOST"
		],
		"Europe/Oslo": [
			"0:43 - LMT 1895_0_1 0:43",
			"1 Norway CE%sT 1940_7_10_23 1",
			"1 C-Eur CE%sT 1945_3_2_2 1",
			"1 Norway CE%sT 1980 1",
			"1 EU CE%sT"
		],
		"Asia/Aden": [
			"2:59:54 - LMT 1950 2:59:54",
			"3 - AST"
		],
		"Asia/Almaty": [
			"5:7:48 - LMT 1924_4_2 5:7:48",
			"5 - ALMT 1930_5_21 5",
			"6 RussiaAsia ALM%sT 1991 6",
			"6 - ALMT 1992 6",
			"6 RussiaAsia ALM%sT 2005_2_15 6",
			"6 - ALMT"
		],
		"Asia/Amman": [
			"2:23:44 - LMT 1931 2:23:44",
			"2 Jordan EE%sT"
		],
		"Asia/Anadyr": [
			"11:49:56 - LMT 1924_4_2 11:49:56",
			"12 - ANAT 1930_5_21 12",
			"13 Russia ANA%sT 1982_3_1_0 13",
			"12 Russia ANA%sT 1991_2_31_2 12",
			"11 Russia ANA%sT 1992_0_19_2 11",
			"12 Russia ANA%sT 2010_2_28_2 12",
			"11 Russia ANA%sT 2011_2_27_2 11",
			"12 - ANAT"
		],
		"Asia/Aqtau": [
			"3:21:4 - LMT 1924_4_2 3:21:4",
			"4 - FORT 1930_5_21 4",
			"5 - FORT 1963 5",
			"5 - SHET 1981_9_1 5",
			"6 - SHET 1982_3_1 6",
			"5 RussiaAsia SHE%sT 1991 5",
			"5 - SHET 1991_11_16 5",
			"5 RussiaAsia AQT%sT 1995_2_26_2 5",
			"4 RussiaAsia AQT%sT 2005_2_15 4",
			"5 - AQTT"
		],
		"Asia/Aqtobe": [
			"3:48:40 - LMT 1924_4_2 3:48:40",
			"4 - AKTT 1930_5_21 4",
			"5 - AKTT 1981_3_1 5",
			"6 - AKTST 1981_9_1 6",
			"6 - AKTT 1982_3_1 6",
			"5 RussiaAsia AKT%sT 1991 5",
			"5 - AKTT 1991_11_16 5",
			"5 RussiaAsia AQT%sT 2005_2_15 5",
			"5 - AQTT"
		],
		"Asia/Ashgabat": [
			"3:53:32 - LMT 1924_4_2 3:53:32",
			"4 - ASHT 1930_5_21 4",
			"5 RussiaAsia ASH%sT 1991_2_31_2 5",
			"4 RussiaAsia ASH%sT 1991_9_27 4",
			"4 RussiaAsia TM%sT 1992_0_19_2 4",
			"5 - TMT"
		],
		"Asia/Baghdad": [
			"2:57:40 - LMT 1890 2:57:40",
			"2:57:36 - BMT 1918 2:57:36",
			"3 - AST 1982_4 3",
			"3 Iraq A%sT"
		],
		"Asia/Bahrain": [
			"3:22:20 - LMT 1920 3:22:20",
			"4 - GST 1972_5 4",
			"3 - AST"
		],
		"Asia/Baku": [
			"3:19:24 - LMT 1924_4_2 3:19:24",
			"3 - BAKT 1957_2 3",
			"4 RussiaAsia BAK%sT 1991_2_31_2 4",
			"4 - BAKST 1991_7_30 4",
			"3 RussiaAsia AZ%sT 1992_8_26_23 4",
			"4 - AZT 1996 4",
			"4 EUAsia AZ%sT 1997 4",
			"4 Azer AZ%sT"
		],
		"Asia/Bangkok": [
			"6:42:4 - LMT 1880 6:42:4",
			"6:42:4 - BMT 1920_3 6:42:4",
			"7 - ICT"
		],
		"Asia/Beirut": [
			"2:22 - LMT 1880 2:22",
			"2 Lebanon EE%sT"
		],
		"Asia/Bishkek": [
			"4:58:24 - LMT 1924_4_2 4:58:24",
			"5 - FRUT 1930_5_21 5",
			"6 RussiaAsia FRU%sT 1991_2_31_2 6",
			"6 - FRUST 1991_7_31_2 6",
			"5 Kyrgyz KG%sT 2005_7_12 6",
			"6 - KGT"
		],
		"Asia/Brunei": [
			"7:39:40 - LMT 1926_2 7:39:40",
			"7:30 - BNT 1933 7:30",
			"8 - BNT"
		],
		"Asia/Choibalsan": [
			"7:38 - LMT 1905_7 7:38",
			"7 - ULAT 1978 7",
			"8 - ULAT 1983_3 8",
			"9 Mongol CHO%sT 2008_2_31 9",
			"8 Mongol CHO%sT"
		],
		"Asia/Chongqing": [
			"7:6:20 - LMT 1928 7:6:20",
			"7 - LONT 1980_4 7",
			"8 PRC C%sT"
		],
		"Asia/Colombo": [
			"5:19:24 - LMT 1880 5:19:24",
			"5:19:32 - MMT 1906 5:19:32",
			"5:30 - IST 1942_0_5 5:30",
			"6 - IHST 1942_8 6",
			"6:30 - IST 1945_9_16_2 6:30",
			"5:30 - IST 1996_4_25_0 5:30",
			"6:30 - LKT 1996_9_26_0_30 6:30",
			"6 - LKT 2006_3_15_0_30 6",
			"5:30 - IST"
		],
		"Asia/Damascus": [
			"2:25:12 - LMT 1920 2:25:12",
			"2 Syria EE%sT"
		],
		"Asia/Dhaka": [
			"6:1:40 - LMT 1890 6:1:40",
			"5:53:20 - HMT 1941_9 5:53:20",
			"6:30 - BURT 1942_4_15 6:30",
			"5:30 - IST 1942_8 5:30",
			"6:30 - BURT 1951_8_30 6:30",
			"6 - DACT 1971_2_26 6",
			"6 - BDT 2009 6",
			"6 Dhaka BD%sT"
		],
		"Asia/Dili": [
			"8:22:20 - LMT 1912 8:22:20",
			"8 - TLT 1942_1_21_23 8",
			"9 - JST 1945_8_23 9",
			"9 - TLT 1976_4_3 9",
			"8 - CIT 2000_8_17_00 8",
			"9 - TLT"
		],
		"Asia/Dubai": [
			"3:41:12 - LMT 1920 3:41:12",
			"4 - GST"
		],
		"Asia/Dushanbe": [
			"4:35:12 - LMT 1924_4_2 4:35:12",
			"5 - DUST 1930_5_21 5",
			"6 RussiaAsia DUS%sT 1991_2_31_2 6",
			"6 - DUSST 1991_8_9_2 5",
			"5 - TJT"
		],
		"Asia/Gaza": [
			"2:17:52 - LMT 1900_9 2:17:52",
			"2 Zion EET 1948_4_15 2",
			"2 EgyptAsia EE%sT 1967_5_5 3",
			"2 Zion I%sT 1996 2",
			"2 Jordan EE%sT 1999 2",
			"2 Palestine EE%sT 2008_7_29_0 3",
			"2 - EET 2008_8 2",
			"2 Palestine EE%sT 2010 2",
			"2 - EET 2010_2_27_0_1 2",
			"2 Palestine EE%sT 2011_7_1 3",
			"2 - EET 2012 2",
			"2 Palestine EE%sT"
		],
		"Asia/Harbin": [
			"8:26:44 - LMT 1928 8:26:44",
			"8:30 - CHAT 1932_2 8:30",
			"8 - CST 1940 8",
			"9 - CHAT 1966_4 9",
			"8:30 - CHAT 1980_4 8:30",
			"8 PRC C%sT"
		],
		"Asia/Hebron": [
			"2:20:23 - LMT 1900_9 2:20:23",
			"2 Zion EET 1948_4_15 2",
			"2 EgyptAsia EE%sT 1967_5_5 3",
			"2 Zion I%sT 1996 2",
			"2 Jordan EE%sT 1999 2",
			"2 Palestine EE%sT"
		],
		"Asia/Ho_Chi_Minh": [
			"7:6:40 - LMT 1906_5_9 7:6:40",
			"7:6:20 - SMT 1911_2_11_0_1 7:6:20",
			"7 - ICT 1912_4 7",
			"8 - ICT 1931_4 8",
			"7 - ICT"
		],
		"Asia/Hong_Kong": [
			"7:36:42 - LMT 1904_9_30 7:36:42",
			"8 HK HK%sT 1941_11_25 8",
			"9 - JST 1945_8_15 9",
			"8 HK HK%sT"
		],
		"Asia/Hovd": [
			"6:6:36 - LMT 1905_7 6:6:36",
			"6 - HOVT 1978 6",
			"7 Mongol HOV%sT"
		],
		"Asia/Irkutsk": [
			"6:57:20 - LMT 1880 6:57:20",
			"6:57:20 - IMT 1920_0_25 6:57:20",
			"7 - IRKT 1930_5_21 7",
			"8 Russia IRK%sT 1991_2_31_2 8",
			"7 Russia IRK%sT 1992_0_19_2 7",
			"8 Russia IRK%sT 2011_2_27_2 8",
			"9 - IRKT"
		],
		"Asia/Jakarta": [
			"7:7:12 - LMT 1867_7_10 7:7:12",
			"7:7:12 - JMT 1923_11_31_23_47_12 7:7:12",
			"7:20 - JAVT 1932_10 7:20",
			"7:30 - WIT 1942_2_23 7:30",
			"9 - JST 1945_8_23 9",
			"7:30 - WIT 1948_4 7:30",
			"8 - WIT 1950_4 8",
			"7:30 - WIT 1964 7:30",
			"7 - WIT"
		],
		"Asia/Jayapura": [
			"9:22:48 - LMT 1932_10 9:22:48",
			"9 - EIT 1944_8_1 9",
			"9:30 - CST 1964 9:30",
			"9 - EIT"
		],
		"Asia/Jerusalem": [
			"2:20:56 - LMT 1880 2:20:56",
			"2:20:40 - JMT 1918 2:20:40",
			"2 Zion I%sT"
		],
		"Asia/Kabul": [
			"4:36:48 - LMT 1890 4:36:48",
			"4 - AFT 1945 4",
			"4:30 - AFT"
		],
		"Asia/Kamchatka": [
			"10:34:36 - LMT 1922_10_10 10:34:36",
			"11 - PETT 1930_5_21 11",
			"12 Russia PET%sT 1991_2_31_2 12",
			"11 Russia PET%sT 1992_0_19_2 11",
			"12 Russia PET%sT 2010_2_28_2 12",
			"11 Russia PET%sT 2011_2_27_2 11",
			"12 - PETT"
		],
		"Asia/Karachi": [
			"4:28:12 - LMT 1907 4:28:12",
			"5:30 - IST 1942_8 5:30",
			"6:30 - IST 1945_9_15 6:30",
			"5:30 - IST 1951_8_30 5:30",
			"5 - KART 1971_2_26 5",
			"5 Pakistan PK%sT"
		],
		"Asia/Kashgar": [
			"5:3:56 - LMT 1928 5:3:56",
			"5:30 - KAST 1940 5:30",
			"5 - KAST 1980_4 5",
			"8 PRC C%sT"
		],
		"Asia/Kathmandu": [
			"5:41:16 - LMT 1920 5:41:16",
			"5:30 - IST 1986 5:30",
			"5:45 - NPT"
		],
		"Asia/Khandyga": [
			"9:2:13 - LMT 1919_11_15 9:2:13",
			"8 - YAKT 1930_5_21 8",
			"9 Russia YAK%sT 1991_2_31_2 9",
			"8 Russia YAK%sT 1992_0_19_2 8",
			"9 Russia YAK%sT 2004 9",
			"10 Russia VLA%sT 2011_2_27_2 10",
			"11 - VLAT 2011_8_13_0 11",
			"10 - YAKT"
		],
		"Asia/Kolkata": [
			"5:53:28 - LMT 1880 5:53:28",
			"5:53:20 - HMT 1941_9 5:53:20",
			"6:30 - BURT 1942_4_15 6:30",
			"5:30 - IST 1942_8 5:30",
			"6:30 - IST 1945_9_15 6:30",
			"5:30 - IST"
		],
		"Asia/Krasnoyarsk": [
			"6:11:20 - LMT 1920_0_6 6:11:20",
			"6 - KRAT 1930_5_21 6",
			"7 Russia KRA%sT 1991_2_31_2 7",
			"6 Russia KRA%sT 1992_0_19_2 6",
			"7 Russia KRA%sT 2011_2_27_2 7",
			"8 - KRAT"
		],
		"Asia/Kuala_Lumpur": [
			"6:46:46 - LMT 1901_0_1 6:46:46",
			"6:55:25 - SMT 1905_5_1 6:55:25",
			"7 - MALT 1933_0_1 7",
			"7:20 - MALST 1936_0_1 7:20",
			"7:20 - MALT 1941_8_1 7:20",
			"7:30 - MALT 1942_1_16 7:30",
			"9 - JST 1945_8_12 9",
			"7:30 - MALT 1982_0_1 7:30",
			"8 - MYT"
		],
		"Asia/Kuching": [
			"7:21:20 - LMT 1926_2 7:21:20",
			"7:30 - BORT 1933 7:30",
			"8 NBorneo BOR%sT 1942_1_16 8",
			"9 - JST 1945_8_12 9",
			"8 - BORT 1982_0_1 8",
			"8 - MYT"
		],
		"Asia/Kuwait": [
			"3:11:56 - LMT 1950 3:11:56",
			"3 - AST"
		],
		"Asia/Macau": [
			"7:34:20 - LMT 1912 7:34:20",
			"8 Macau MO%sT 1999_11_20 8",
			"8 PRC C%sT"
		],
		"Asia/Magadan": [
			"10:3:12 - LMT 1924_4_2 10:3:12",
			"10 - MAGT 1930_5_21 10",
			"11 Russia MAG%sT 1991_2_31_2 11",
			"10 Russia MAG%sT 1992_0_19_2 10",
			"11 Russia MAG%sT 2011_2_27_2 11",
			"12 - MAGT"
		],
		"Asia/Makassar": [
			"7:57:36 - LMT 1920 7:57:36",
			"7:57:36 - MMT 1932_10 7:57:36",
			"8 - CIT 1942_1_9 8",
			"9 - JST 1945_8_23 9",
			"8 - CIT"
		],
		"Asia/Manila": [
			"-15:56 - LMT 1844_11_31 -15:56",
			"8:4 - LMT 1899_4_11 8:4",
			"8 Phil PH%sT 1942_4 8",
			"9 - JST 1944_10 9",
			"8 Phil PH%sT"
		],
		"Asia/Muscat": [
			"3:54:24 - LMT 1920 3:54:24",
			"4 - GST"
		],
		"Asia/Nicosia": [
			"2:13:28 - LMT 1921_10_14 2:13:28",
			"2 Cyprus EE%sT 1998_8 3",
			"2 EUAsia EE%sT"
		],
		"Asia/Novokuznetsk": [
			"5:48:48 - NMT 1920_0_6 5:48:48",
			"6 - KRAT 1930_5_21 6",
			"7 Russia KRA%sT 1991_2_31_2 7",
			"6 Russia KRA%sT 1992_0_19_2 6",
			"7 Russia KRA%sT 2010_2_28_2 7",
			"6 Russia NOV%sT 2011_2_27_2 6",
			"7 - NOVT"
		],
		"Asia/Novosibirsk": [
			"5:31:40 - LMT 1919_11_14_6 5:31:40",
			"6 - NOVT 1930_5_21 6",
			"7 Russia NOV%sT 1991_2_31_2 7",
			"6 Russia NOV%sT 1992_0_19_2 6",
			"7 Russia NOV%sT 1993_4_23 8",
			"6 Russia NOV%sT 2011_2_27_2 6",
			"7 - NOVT"
		],
		"Asia/Omsk": [
			"4:53:36 - LMT 1919_10_14 4:53:36",
			"5 - OMST 1930_5_21 5",
			"6 Russia OMS%sT 1991_2_31_2 6",
			"5 Russia OMS%sT 1992_0_19_2 5",
			"6 Russia OMS%sT 2011_2_27_2 6",
			"7 - OMST"
		],
		"Asia/Oral": [
			"3:25:24 - LMT 1924_4_2 3:25:24",
			"4 - URAT 1930_5_21 4",
			"5 - URAT 1981_3_1 5",
			"6 - URAST 1981_9_1 6",
			"6 - URAT 1982_3_1 6",
			"5 RussiaAsia URA%sT 1989_2_26_2 5",
			"4 RussiaAsia URA%sT 1991 4",
			"4 - URAT 1991_11_16 4",
			"4 RussiaAsia ORA%sT 2005_2_15 4",
			"5 - ORAT"
		],
		"Asia/Phnom_Penh": [
			"6:59:40 - LMT 1906_5_9 6:59:40",
			"7:6:20 - SMT 1911_2_11_0_1 7:6:20",
			"7 - ICT 1912_4 7",
			"8 - ICT 1931_4 8",
			"7 - ICT"
		],
		"Asia/Pontianak": [
			"7:17:20 - LMT 1908_4 7:17:20",
			"7:17:20 - PMT 1932_10 7:17:20",
			"7:30 - WIT 1942_0_29 7:30",
			"9 - JST 1945_8_23 9",
			"7:30 - WIT 1948_4 7:30",
			"8 - WIT 1950_4 8",
			"7:30 - WIT 1964 7:30",
			"8 - CIT 1988_0_1 8",
			"7 - WIT"
		],
		"Asia/Pyongyang": [
			"8:23 - LMT 1890 8:23",
			"8:30 - KST 1904_11 8:30",
			"9 - KST 1928 9",
			"8:30 - KST 1932 8:30",
			"9 - KST 1954_2_21 9",
			"8 - KST 1961_7_10 8",
			"9 - KST"
		],
		"Asia/Qatar": [
			"3:26:8 - LMT 1920 3:26:8",
			"4 - GST 1972_5 4",
			"3 - AST"
		],
		"Asia/Qyzylorda": [
			"4:21:52 - LMT 1924_4_2 4:21:52",
			"4 - KIZT 1930_5_21 4",
			"5 - KIZT 1981_3_1 5",
			"6 - KIZST 1981_9_1 6",
			"6 - KIZT 1982_3_1 6",
			"5 RussiaAsia KIZ%sT 1991 5",
			"5 - KIZT 1991_11_16 5",
			"5 - QYZT 1992_0_19_2 5",
			"6 RussiaAsia QYZ%sT 2005_2_15 6",
			"6 - QYZT"
		],
		"Asia/Rangoon": [
			"6:24:40 - LMT 1880 6:24:40",
			"6:24:40 - RMT 1920 6:24:40",
			"6:30 - BURT 1942_4 6:30",
			"9 - JST 1945_4_3 9",
			"6:30 - MMT"
		],
		"Asia/Riyadh": [
			"3:6:52 - LMT 1950 3:6:52",
			"3 - AST"
		],
		"Asia/Sakhalin": [
			"9:30:48 - LMT 1905_7_23 9:30:48",
			"9 - CJT 1938 9",
			"9 - JST 1945_7_25 9",
			"11 Russia SAK%sT 1991_2_31_2 11",
			"10 Russia SAK%sT 1992_0_19_2 10",
			"11 Russia SAK%sT 1997_2_30_2 11",
			"10 Russia SAK%sT 2011_2_27_2 10",
			"11 - SAKT"
		],
		"Asia/Samarkand": [
			"4:27:12 - LMT 1924_4_2 4:27:12",
			"4 - SAMT 1930_5_21 4",
			"5 - SAMT 1981_3_1 5",
			"6 - SAMST 1981_9_1 6",
			"6 - TAST 1982_3_1 6",
			"5 RussiaAsia SAM%sT 1991_8_1 6",
			"5 RussiaAsia UZ%sT 1992 5",
			"5 - UZT"
		],
		"Asia/Seoul": [
			"8:27:52 - LMT 1890 8:27:52",
			"8:30 - KST 1904_11 8:30",
			"9 - KST 1928 9",
			"8:30 - KST 1932 8:30",
			"9 - KST 1954_2_21 9",
			"8 ROK K%sT 1961_7_10 8",
			"8:30 - KST 1968_9 8:30",
			"9 ROK K%sT"
		],
		"Asia/Shanghai": [
			"8:5:57 - LMT 1928 8:5:57",
			"8 Shang C%sT 1949 8",
			"8 PRC C%sT"
		],
		"Asia/Singapore": [
			"6:55:25 - LMT 1901_0_1 6:55:25",
			"6:55:25 - SMT 1905_5_1 6:55:25",
			"7 - MALT 1933_0_1 7",
			"7:20 - MALST 1936_0_1 7:20",
			"7:20 - MALT 1941_8_1 7:20",
			"7:30 - MALT 1942_1_16 7:30",
			"9 - JST 1945_8_12 9",
			"7:30 - MALT 1965_7_9 7:30",
			"7:30 - SGT 1982_0_1 7:30",
			"8 - SGT"
		],
		"Asia/Taipei": [
			"8:6 - LMT 1896 8:6",
			"8 Taiwan C%sT"
		],
		"Asia/Tashkent": [
			"4:37:12 - LMT 1924_4_2 4:37:12",
			"5 - TAST 1930_5_21 5",
			"6 RussiaAsia TAS%sT 1991_2_31_2 6",
			"5 RussiaAsia TAS%sT 1991_8_1 6",
			"5 RussiaAsia UZ%sT 1992 5",
			"5 - UZT"
		],
		"Asia/Tbilisi": [
			"2:59:16 - LMT 1880 2:59:16",
			"2:59:16 - TBMT 1924_4_2 2:59:16",
			"3 - TBIT 1957_2 3",
			"4 RussiaAsia TBI%sT 1991_2_31_2 4",
			"4 - TBIST 1991_3_9 4",
			"3 RussiaAsia GE%sT 1992 3",
			"3 E-EurAsia GE%sT 1994_8_25 4",
			"4 E-EurAsia GE%sT 1996_9_27 5",
			"5 - GEST 1997_2_30 5",
			"4 E-EurAsia GE%sT 2004_5_27 5",
			"3 RussiaAsia GE%sT 2005_2_27_2 3",
			"4 - GET"
		],
		"Asia/Tehran": [
			"3:25:44 - LMT 1916 3:25:44",
			"3:25:44 - TMT 1946 3:25:44",
			"3:30 - IRST 1977_10 3:30",
			"4 Iran IR%sT 1979 4",
			"3:30 Iran IR%sT"
		],
		"Asia/Thimphu": [
			"5:58:36 - LMT 1947_7_15 5:58:36",
			"5:30 - IST 1987_9 5:30",
			"6 - BTT"
		],
		"Asia/Tokyo": [
			"9:18:59 - LMT 1887_11_31_15",
			"9 - JST 1896 9",
			"9 - CJT 1938 9",
			"9 Japan J%sT"
		],
		"Asia/Ulaanbaatar": [
			"7:7:32 - LMT 1905_7 7:7:32",
			"7 - ULAT 1978 7",
			"8 Mongol ULA%sT"
		],
		"Asia/Urumqi": [
			"5:50:20 - LMT 1928 5:50:20",
			"6 - URUT 1980_4 6",
			"8 PRC C%sT"
		],
		"Asia/Ust-Nera": [
			"9:32:54 - LMT 1919_11_15 9:32:54",
			"8 - YAKT 1930_5_21 8",
			"9 Russia YAKT 1981_3_1 9",
			"11 Russia MAG%sT 1991_2_31_2 11",
			"10 Russia MAG%sT 1992_0_19_2 10",
			"11 Russia MAG%sT 2011_2_27_2 11",
			"12 - MAGT 2011_8_13_0 12",
			"11 - VLAT"
		],
		"Asia/Vientiane": [
			"6:50:24 - LMT 1906_5_9 6:50:24",
			"7:6:20 - SMT 1911_2_11_0_1 7:6:20",
			"7 - ICT 1912_4 7",
			"8 - ICT 1931_4 8",
			"7 - ICT"
		],
		"Asia/Vladivostok": [
			"8:47:44 - LMT 1922_10_15 8:47:44",
			"9 - VLAT 1930_5_21 9",
			"10 Russia VLA%sT 1991_2_31_2 10",
			"9 Russia VLA%sST 1992_0_19_2 9",
			"10 Russia VLA%sT 2011_2_27_2 10",
			"11 - VLAT"
		],
		"Asia/Yakutsk": [
			"8:38:40 - LMT 1919_11_15 8:38:40",
			"8 - YAKT 1930_5_21 8",
			"9 Russia YAK%sT 1991_2_31_2 9",
			"8 Russia YAK%sT 1992_0_19_2 8",
			"9 Russia YAK%sT 2011_2_27_2 9",
			"10 - YAKT"
		],
		"Asia/Yekaterinburg": [
			"4:2:24 - LMT 1919_6_15_4 4:2:24",
			"4 - SVET 1930_5_21 4",
			"5 Russia SVE%sT 1991_2_31_2 5",
			"4 Russia SVE%sT 1992_0_19_2 4",
			"5 Russia YEK%sT 2011_2_27_2 5",
			"6 - YEKT"
		],
		"Asia/Yerevan": [
			"2:58 - LMT 1924_4_2 2:58",
			"3 - YERT 1957_2 3",
			"4 RussiaAsia YER%sT 1991_2_31_2 4",
			"4 - YERST 1991_8_23 4",
			"3 RussiaAsia AM%sT 1995_8_24_2 3",
			"4 - AMT 1997 4",
			"4 RussiaAsia AM%sT 2012_2_25_2 4",
			"4 - AMT"
		],
		"Atlantic/Azores": [
			"-1:42:40 - LMT 1884 -1:42:40",
			"-1:54:32 - HMT 1911_4_24 -1:54:32",
			"-2 Port AZO%sT 1966_3_3_2 -2",
			"-1 Port AZO%sT 1983_8_25_1 -1",
			"-1 W-Eur AZO%sT 1992_8_27_1 -1",
			"0 EU WE%sT 1993_2_28_1",
			"-1 EU AZO%sT"
		],
		"Atlantic/Bermuda": [
			"-4:19:18 - LMT 1930_0_1_2 -4:19:18",
			"-4 - AST 1974_3_28_2 -4",
			"-4 Bahamas A%sT 1976 -4",
			"-4 US A%sT"
		],
		"Atlantic/Canary": [
			"-1:1:36 - LMT 1922_2 -1:1:36",
			"-1 - CANT 1946_8_30_1 -1",
			"0 - WET 1980_3_6_0",
			"1 - WEST 1980_8_28_0",
			"0 EU WE%sT"
		],
		"Atlantic/Cape_Verde": [
			"-1:34:4 - LMT 1907 -1:34:4",
			"-2 - CVT 1942_8 -2",
			"-1 - CVST 1945_9_15 -1",
			"-2 - CVT 1975_10_25_2 -2",
			"-1 - CVT"
		],
		"Atlantic/Faroe": [
			"-0:27:4 - LMT 1908_0_11 -0:27:4",
			"0 - WET 1981",
			"0 EU WE%sT"
		],
		"Atlantic/Madeira": [
			"-1:7:36 - LMT 1884 -1:7:36",
			"-1:7:36 - FMT 1911_4_24 -1:7:36",
			"-1 Port MAD%sT 1966_3_3_2 -1",
			"0 Port WE%sT 1983_8_25_1",
			"0 EU WE%sT"
		],
		"Atlantic/Reykjavik": [
			"-1:27:24 - LMT 1837 -1:27:24",
			"-1:27:48 - RMT 1908 -1:27:48",
			"-1 Iceland IS%sT 1968_3_7_1 -1",
			"0 - GMT"
		],
		"Atlantic/South_Georgia": [
			"-2:26:8 - LMT 1890 -2:26:8",
			"-2 - GST"
		],
		"Atlantic/St_Helena": [
			"-0:22:48 - LMT 1890 -0:22:48",
			"-0:22:48 - JMT 1951 -0:22:48",
			"0 - GMT"
		],
		"Atlantic/Stanley": [
			"-3:51:24 - LMT 1890 -3:51:24",
			"-3:51:24 - SMT 1912_2_12 -3:51:24",
			"-4 Falk FK%sT 1983_4 -4",
			"-3 Falk FK%sT 1985_8_15 -3",
			"-4 Falk FK%sT 2010_8_5_02 -4",
			"-3 - FKST"
		],
		"Australia/Adelaide": [
			"9:14:20 - LMT 1895_1 9:14:20",
			"9 - CST 1899_4 9",
			"9:30 Aus CST 1971 9:30",
			"9:30 AS CST"
		],
		"Australia/Brisbane": [
			"10:12:8 - LMT 1895 10:12:8",
			"10 Aus EST 1971 10",
			"10 AQ EST"
		],
		"Australia/Broken_Hill": [
			"9:25:48 - LMT 1895_1 9:25:48",
			"10 - EST 1896_7_23 10",
			"9 - CST 1899_4 9",
			"9:30 Aus CST 1971 9:30",
			"9:30 AN CST 2000 10:30",
			"9:30 AS CST"
		],
		"Australia/Currie": [
			"9:35:28 - LMT 1895_8 9:35:28",
			"10 - EST 1916_9_1_2 10",
			"11 - EST 1917_1 11",
			"10 Aus EST 1971_6 10",
			"10 AT EST"
		],
		"Australia/Darwin": [
			"8:43:20 - LMT 1895_1 8:43:20",
			"9 - CST 1899_4 9",
			"9:30 Aus CST"
		],
		"Australia/Eucla": [
			"8:35:28 - LMT 1895_11 8:35:28",
			"8:45 Aus CWST 1943_6 8:45",
			"8:45 AW CWST"
		],
		"Australia/Hobart": [
			"9:49:16 - LMT 1895_8 9:49:16",
			"10 - EST 1916_9_1_2 10",
			"11 - EST 1917_1 11",
			"10 Aus EST 1967 10",
			"10 AT EST"
		],
		"Australia/Lindeman": [
			"9:55:56 - LMT 1895 9:55:56",
			"10 Aus EST 1971 10",
			"10 AQ EST 1992_6 10",
			"10 Holiday EST"
		],
		"Australia/Lord_Howe": [
			"10:36:20 - LMT 1895_1 10:36:20",
			"10 - EST 1981_2 10",
			"10:30 LH LHST"
		],
		"Australia/Melbourne": [
			"9:39:52 - LMT 1895_1 9:39:52",
			"10 Aus EST 1971 10",
			"10 AV EST"
		],
		"Australia/Perth": [
			"7:43:24 - LMT 1895_11 7:43:24",
			"8 Aus WST 1943_6 8",
			"8 AW WST"
		],
		"Australia/Sydney": [
			"10:4:52 - LMT 1895_1 10:4:52",
			"10 Aus EST 1971 10",
			"10 AN EST"
		],
		"CET": [
			"1 C-Eur CE%sT"
		],
		"CST6CDT": [
			"-6 US C%sT"
		],
		"EET": [
			"2 EU EE%sT"
		],
		"EST": [
			"-5 - EST"
		],
		"EST5EDT": [
			"-5 US E%sT"
		],
		"HST": [
			"-10 - HST"
		],
		"MET": [
			"1 C-Eur ME%sT"
		],
		"MST": [
			"-7 - MST"
		],
		"MST7MDT": [
			"-7 US M%sT"
		],
		"PST8PDT": [
			"-8 US P%sT"
		],
		"WET": [
			"0 EU WE%sT"
		],
		"Europe/Amsterdam": [
			"0:19:32 - LMT 1835 0:19:32",
			"0:19:32 Neth %s 1937_6_1 1:19:32",
			"0:20 Neth NE%sT 1940_4_16_0 0:20",
			"1 C-Eur CE%sT 1945_3_2_2 1",
			"1 Neth CE%sT 1977 1",
			"1 EU CE%sT"
		],
		"Europe/Andorra": [
			"0:6:4 - LMT 1901 0:6:4",
			"0 - WET 1946_8_30",
			"1 - CET 1985_2_31_2 1",
			"1 EU CE%sT"
		],
		"Europe/Athens": [
			"1:34:52 - LMT 1895_8_14 1:34:52",
			"1:34:52 - AMT 1916_6_28_0_1 1:34:52",
			"2 Greece EE%sT 1941_3_30 3",
			"1 Greece CE%sT 1944_3_4 1",
			"2 Greece EE%sT 1981 2",
			"2 EU EE%sT"
		],
		"Europe/Belgrade": [
			"1:22 - LMT 1884 1:22",
			"1 - CET 1941_3_18_23 1",
			"1 C-Eur CE%sT 1945 1",
			"1 - CET 1945_4_8_2 1",
			"2 - CEST 1945_8_16_2 1",
			"1 - CET 1982_10_27 1",
			"1 EU CE%sT"
		],
		"Europe/Berlin": [
			"0:53:28 - LMT 1893_3 0:53:28",
			"1 C-Eur CE%sT 1945_4_24_2 2",
			"1 SovietZone CE%sT 1946 1",
			"1 Germany CE%sT 1980 1",
			"1 EU CE%sT"
		],
		"Europe/Prague": [
			"0:57:44 - LMT 1850 0:57:44",
			"0:57:44 - PMT 1891_9 0:57:44",
			"1 C-Eur CE%sT 1944_8_17_2 1",
			"1 Czech CE%sT 1979 1",
			"1 EU CE%sT"
		],
		"Europe/Brussels": [
			"0:17:30 - LMT 1880 0:17:30",
			"0:17:30 - BMT 1892_4_1_12 0:17:30",
			"0 - WET 1914_10_8",
			"1 - CET 1916_4_1_0 1",
			"1 C-Eur CE%sT 1918_10_11_11",
			"0 Belgium WE%sT 1940_4_20_2",
			"1 C-Eur CE%sT 1944_8_3 2",
			"1 Belgium CE%sT 1977 1",
			"1 EU CE%sT"
		],
		"Europe/Bucharest": [
			"1:44:24 - LMT 1891_9 1:44:24",
			"1:44:24 - BMT 1931_6_24 1:44:24",
			"2 Romania EE%sT 1981_2_29_2 2",
			"2 C-Eur EE%sT 1991 2",
			"2 Romania EE%sT 1994 2",
			"2 E-Eur EE%sT 1997 2",
			"2 EU EE%sT"
		],
		"Europe/Budapest": [
			"1:16:20 - LMT 1890_9 1:16:20",
			"1 C-Eur CE%sT 1918 1",
			"1 Hungary CE%sT 1941_3_6_2 1",
			"1 C-Eur CE%sT 1945 1",
			"1 Hungary CE%sT 1980_8_28_2 1",
			"1 EU CE%sT"
		],
		"Europe/Zurich": [
			"0:34:8 - LMT 1848_8_12 0:34:8",
			"0:29:44 - BMT 1894_5 0:29:44",
			"1 Swiss CE%sT 1981 1",
			"1 EU CE%sT"
		],
		"Europe/Chisinau": [
			"1:55:20 - LMT 1880 1:55:20",
			"1:55 - CMT 1918_1_15 1:55",
			"1:44:24 - BMT 1931_6_24 1:44:24",
			"2 Romania EE%sT 1940_7_15 2",
			"3 - EEST 1941_6_17 3",
			"1 C-Eur CE%sT 1944_7_24 2",
			"3 Russia MSK/MSD 1990 3",
			"3 - MSK 1990_4_6 3",
			"2 - EET 1991 2",
			"2 Russia EE%sT 1992 2",
			"2 E-Eur EE%sT 1997 2",
			"2 EU EE%sT"
		],
		"Europe/Copenhagen": [
			"0:50:20 - LMT 1890 0:50:20",
			"0:50:20 - CMT 1894_0_1 0:50:20",
			"1 Denmark CE%sT 1942_10_2_2 1",
			"1 C-Eur CE%sT 1945_3_2_2 1",
			"1 Denmark CE%sT 1980 1",
			"1 EU CE%sT"
		],
		"Europe/Dublin": [
			"-0:25 - LMT 1880_7_2 -0:25",
			"-0:25:21 - DMT 1916_4_21_2 -0:25:21",
			"0:34:39 - IST 1916_9_1_2 -0:25:21",
			"0 GB-Eire %s 1921_11_6",
			"0 GB-Eire GMT/IST 1940_1_25_2",
			"1 - IST 1946_9_6_2 1",
			"0 - GMT 1947_2_16_2",
			"1 - IST 1947_10_2_2 1",
			"0 - GMT 1948_3_18_2",
			"0 GB-Eire GMT/IST 1968_9_27 1",
			"1 - IST 1971_9_31_2",
			"0 GB-Eire GMT/IST 1996",
			"0 EU GMT/IST"
		],
		"Europe/Gibraltar": [
			"-0:21:24 - LMT 1880_7_2_0 -0:21:24",
			"0 GB-Eire %s 1957_3_14_2",
			"1 - CET 1982 1",
			"1 EU CE%sT"
		],
		"Europe/London": [
			"-0:1:15 - LMT 1847_11_1_0 -0:1:15",
			"0 GB-Eire %s 1968_9_27 1",
			"1 - BST 1971_9_31_2",
			"0 GB-Eire %s 1996",
			"0 EU GMT/BST"
		],
		"Europe/Helsinki": [
			"1:39:52 - LMT 1878_4_31 1:39:52",
			"1:39:52 - HMT 1921_4 1:39:52",
			"2 Finland EE%sT 1983 2",
			"2 EU EE%sT"
		],
		"Europe/Istanbul": [
			"1:55:52 - LMT 1880 1:55:52",
			"1:56:56 - IMT 1910_9 1:56:56",
			"2 Turkey EE%sT 1978_9_15 3",
			"3 Turkey TR%sT 1985_3_20 3",
			"2 Turkey EE%sT 2007 2",
			"2 EU EE%sT 2011_2_27_1",
			"2 - EET 2011_2_28_1",
			"2 EU EE%sT"
		],
		"Europe/Kaliningrad": [
			"1:22 - LMT 1893_3 1:22",
			"1 C-Eur CE%sT 1945 1",
			"2 Poland CE%sT 1946 2",
			"3 Russia MSK/MSD 1991_2_31_2 3",
			"2 Russia EE%sT 2011_2_27_2 2",
			"3 - FET"
		],
		"Europe/Kiev": [
			"2:2:4 - LMT 1880 2:2:4",
			"2:2:4 - KMT 1924_4_2 2:2:4",
			"2 - EET 1930_5_21 2",
			"3 - MSK 1941_8_20 3",
			"1 C-Eur CE%sT 1943_10_6 1",
			"3 Russia MSK/MSD 1990 3",
			"3 - MSK 1990_6_1_2 3",
			"2 - EET 1992 2",
			"2 E-Eur EE%sT 1995 2",
			"2 EU EE%sT"
		],
		"Europe/Lisbon": [
			"-0:36:32 - LMT 1884 -0:36:32",
			"-0:36:32 - LMT 1912_0_1 -0:36:32",
			"0 Port WE%sT 1966_3_3_2",
			"1 - CET 1976_8_26_1 1",
			"0 Port WE%sT 1983_8_25_1",
			"0 W-Eur WE%sT 1992_8_27_1",
			"1 EU CE%sT 1996_2_31_1",
			"0 EU WE%sT"
		],
		"Europe/Luxembourg": [
			"0:24:36 - LMT 1904_5 0:24:36",
			"1 Lux CE%sT 1918_10_25 1",
			"0 Lux WE%sT 1929_9_6_2",
			"0 Belgium WE%sT 1940_4_14_3 1",
			"1 C-Eur WE%sT 1944_8_18_3 2",
			"1 Belgium CE%sT 1977 1",
			"1 EU CE%sT"
		],
		"Europe/Madrid": [
			"-0:14:44 - LMT 1901_0_1_0 -0:14:44",
			"0 Spain WE%sT 1946_8_30 2",
			"1 Spain CE%sT 1979 1",
			"1 EU CE%sT"
		],
		"Europe/Malta": [
			"0:58:4 - LMT 1893_10_2_0 0:58:4",
			"1 Italy CE%sT 1942_10_2_2 1",
			"1 C-Eur CE%sT 1945_3_2_2 1",
			"1 Italy CE%sT 1973_2_31 1",
			"1 Malta CE%sT 1981 1",
			"1 EU CE%sT"
		],
		"Europe/Minsk": [
			"1:50:16 - LMT 1880 1:50:16",
			"1:50 - MMT 1924_4_2 1:50",
			"2 - EET 1930_5_21 2",
			"3 - MSK 1941_5_28 3",
			"1 C-Eur CE%sT 1944_6_3 2",
			"3 Russia MSK/MSD 1990 3",
			"3 - MSK 1991_2_31_2 3",
			"3 - EEST 1991_8_29_2 2",
			"2 - EET 1992_2_29_0 2",
			"3 - EEST 1992_8_27_0 2",
			"2 Russia EE%sT 2011_2_27_2 2",
			"3 - FET"
		],
		"Europe/Monaco": [
			"0:29:32 - LMT 1891_2_15 0:29:32",
			"0:9:21 - PMT 1911_2_11 0:9:21",
			"0 France WE%sT 1945_8_16_3 2",
			"1 France CE%sT 1977 1",
			"1 EU CE%sT"
		],
		"Europe/Moscow": [
			"2:30:20 - LMT 1880 2:30:20",
			"2:30 - MMT 1916_6_3 2:30",
			"2:30:48 Russia %s 1919_6_1_2 4:30:48",
			"3 Russia MSK/MSD 1922_9 3",
			"2 - EET 1930_5_21 2",
			"3 Russia MSK/MSD 1991_2_31_2 3",
			"2 Russia EE%sT 1992_0_19_2 2",
			"3 Russia MSK/MSD 2011_2_27_2 3",
			"4 - MSK"
		],
		"Europe/Paris": [
			"0:9:21 - LMT 1891_2_15_0_1 0:9:21",
			"0:9:21 - PMT 1911_2_11_0_1 0:9:21",
			"0 France WE%sT 1940_5_14_23 1",
			"1 C-Eur CE%sT 1944_7_25 2",
			"0 France WE%sT 1945_8_16_3 2",
			"1 France CE%sT 1977 1",
			"1 EU CE%sT"
		],
		"Europe/Riga": [
			"1:36:24 - LMT 1880 1:36:24",
			"1:36:24 - RMT 1918_3_15_2 1:36:24",
			"2:36:24 - LST 1918_8_16_3 2:36:24",
			"1:36:24 - RMT 1919_3_1_2 1:36:24",
			"2:36:24 - LST 1919_4_22_3 2:36:24",
			"1:36:24 - RMT 1926_4_11 1:36:24",
			"2 - EET 1940_7_5 2",
			"3 - MSK 1941_6 3",
			"1 C-Eur CE%sT 1944_9_13 1",
			"3 Russia MSK/MSD 1989_2_26_2 3",
			"3 - EEST 1989_8_24_2 2",
			"2 Latvia EE%sT 1997_0_21 2",
			"2 EU EE%sT 2000_1_29 2",
			"2 - EET 2001_0_2 2",
			"2 EU EE%sT"
		],
		"Europe/Rome": [
			"0:49:56 - LMT 1866_8_22 0:49:56",
			"0:49:56 - RMT 1893_10_1_0 0:49:56",
			"1 Italy CE%sT 1942_10_2_2 1",
			"1 C-Eur CE%sT 1944_6 2",
			"1 Italy CE%sT 1980 1",
			"1 EU CE%sT"
		],
		"Europe/Samara": [
			"3:20:36 - LMT 1919_6_1_2 3:20:36",
			"3 - SAMT 1930_5_21 3",
			"4 - SAMT 1935_0_27 4",
			"4 Russia KUY%sT 1989_2_26_2 4",
			"3 Russia KUY%sT 1991_2_31_2 3",
			"2 Russia KUY%sT 1991_8_29_2 2",
			"3 - KUYT 1991_9_20_3 3",
			"4 Russia SAM%sT 2010_2_28_2 4",
			"3 Russia SAM%sT 2011_2_27_2 3",
			"4 - SAMT"
		],
		"Europe/Simferopol": [
			"2:16:24 - LMT 1880 2:16:24",
			"2:16 - SMT 1924_4_2 2:16",
			"2 - EET 1930_5_21 2",
			"3 - MSK 1941_10 3",
			"1 C-Eur CE%sT 1944_3_13 2",
			"3 Russia MSK/MSD 1990 3",
			"3 - MSK 1990_6_1_2 3",
			"2 - EET 1992 2",
			"2 E-Eur EE%sT 1994_4 3",
			"3 E-Eur MSK/MSD 1996_2_31_3 3",
			"4 - MSD 1996_9_27_3 3",
			"3 Russia MSK/MSD 1997 3",
			"3 - MSK 1997_2_30_1",
			"2 EU EE%sT"
		],
		"Europe/Sofia": [
			"1:33:16 - LMT 1880 1:33:16",
			"1:56:56 - IMT 1894_10_30 1:56:56",
			"2 - EET 1942_10_2_3 2",
			"1 C-Eur CE%sT 1945 1",
			"1 - CET 1945_3_2_3 1",
			"2 - EET 1979_2_31_23 2",
			"2 Bulg EE%sT 1982_8_26_2 3",
			"2 C-Eur EE%sT 1991 2",
			"2 E-Eur EE%sT 1997 2",
			"2 EU EE%sT"
		],
		"Europe/Stockholm": [
			"1:12:12 - LMT 1879_0_1 1:12:12",
			"1:0:14 - SET 1900_0_1 1:0:14",
			"1 - CET 1916_4_14_23 1",
			"2 - CEST 1916_9_1_01 2",
			"1 - CET 1980 1",
			"1 EU CE%sT"
		],
		"Europe/Tallinn": [
			"1:39 - LMT 1880 1:39",
			"1:39 - TMT 1918_1 1:39",
			"1 C-Eur CE%sT 1919_6 1",
			"1:39 - TMT 1921_4 1:39",
			"2 - EET 1940_7_6 2",
			"3 - MSK 1941_8_15 3",
			"1 C-Eur CE%sT 1944_8_22 2",
			"3 Russia MSK/MSD 1989_2_26_2 3",
			"3 - EEST 1989_8_24_2 2",
			"2 C-Eur EE%sT 1998_8_22 3",
			"2 EU EE%sT 1999_10_1 3",
			"2 - EET 2002_1_21 2",
			"2 EU EE%sT"
		],
		"Europe/Tirane": [
			"1:19:20 - LMT 1914 1:19:20",
			"1 - CET 1940_5_16 1",
			"1 Albania CE%sT 1984_6 2",
			"1 EU CE%sT"
		],
		"Europe/Uzhgorod": [
			"1:29:12 - LMT 1890_9 1:29:12",
			"1 - CET 1940 1",
			"1 C-Eur CE%sT 1944_9 2",
			"2 - CEST 1944_9_26 2",
			"1 - CET 1945_5_29 1",
			"3 Russia MSK/MSD 1990 3",
			"3 - MSK 1990_6_1_2 3",
			"1 - CET 1991_2_31_3 1",
			"2 - EET 1992 2",
			"2 E-Eur EE%sT 1995 2",
			"2 EU EE%sT"
		],
		"Europe/Vaduz": [
			"0:38:4 - LMT 1894_5 0:38:4",
			"1 - CET 1981 1",
			"1 EU CE%sT"
		],
		"Europe/Vienna": [
			"1:5:21 - LMT 1893_3 1:5:21",
			"1 C-Eur CE%sT 1920 1",
			"1 Austria CE%sT 1940_3_1_2 1",
			"1 C-Eur CE%sT 1945_3_2_2 1",
			"2 - CEST 1945_3_12_2 1",
			"1 - CET 1946 1",
			"1 Austria CE%sT 1981 1",
			"1 EU CE%sT"
		],
		"Europe/Vilnius": [
			"1:41:16 - LMT 1880 1:41:16",
			"1:24 - WMT 1917 1:24",
			"1:35:36 - KMT 1919_9_10 1:35:36",
			"1 - CET 1920_6_12 1",
			"2 - EET 1920_9_9 2",
			"1 - CET 1940_7_3 1",
			"3 - MSK 1941_5_24 3",
			"1 C-Eur CE%sT 1944_7 2",
			"3 Russia MSK/MSD 1991_2_31_2 3",
			"3 - EEST 1991_8_29_2 2",
			"2 C-Eur EE%sT 1998 2",
			"2 - EET 1998_2_29_1",
			"1 EU CE%sT 1999_9_31_1",
			"2 - EET 2003_0_1 2",
			"2 EU EE%sT"
		],
		"Europe/Volgograd": [
			"2:57:40 - LMT 1920_0_3 2:57:40",
			"3 - TSAT 1925_3_6 3",
			"3 - STAT 1930_5_21 3",
			"4 - STAT 1961_10_11 4",
			"4 Russia VOL%sT 1989_2_26_2 4",
			"3 Russia VOL%sT 1991_2_31_2 3",
			"4 - VOLT 1992_2_29_2 4",
			"3 Russia VOL%sT 2011_2_27_2 3",
			"4 - VOLT"
		],
		"Europe/Warsaw": [
			"1:24 - LMT 1880 1:24",
			"1:24 - WMT 1915_7_5 1:24",
			"1 C-Eur CE%sT 1918_8_16_3 2",
			"2 Poland EE%sT 1922_5 2",
			"1 Poland CE%sT 1940_5_23_2 1",
			"1 C-Eur CE%sT 1944_9 2",
			"1 Poland CE%sT 1977 1",
			"1 W-Eur CE%sT 1988 1",
			"1 EU CE%sT"
		],
		"Europe/Zaporozhye": [
			"2:20:40 - LMT 1880 2:20:40",
			"2:20 - CUT 1924_4_2 2:20",
			"2 - EET 1930_5_21 2",
			"3 - MSK 1941_7_25 3",
			"1 C-Eur CE%sT 1943_9_25 1",
			"3 Russia MSK/MSD 1991_2_31_2 3",
			"2 E-Eur EE%sT 1995 2",
			"2 EU EE%sT"
		],
		"Indian/Antananarivo": [
			"3:10:4 - LMT 1911_6 3:10:4",
			"3 - EAT 1954_1_27_23 3",
			"4 - EAST 1954_4_29_23 3",
			"3 - EAT"
		],
		"Indian/Chagos": [
			"4:49:40 - LMT 1907 4:49:40",
			"5 - IOT 1996 5",
			"6 - IOT"
		],
		"Indian/Christmas": [
			"7:2:52 - LMT 1895_1 7:2:52",
			"7 - CXT"
		],
		"Indian/Cocos": [
			"6:27:40 - LMT 1900 6:27:40",
			"6:30 - CCT"
		],
		"Indian/Comoro": [
			"2:53:4 - LMT 1911_6 2:53:4",
			"3 - EAT"
		],
		"Indian/Kerguelen": [
			"0 - zzz 1950",
			"5 - TFT"
		],
		"Indian/Mahe": [
			"3:41:48 - LMT 1906_5 3:41:48",
			"4 - SCT"
		],
		"Indian/Maldives": [
			"4:54 - LMT 1880 4:54",
			"4:54 - MMT 1960 4:54",
			"5 - MVT"
		],
		"Indian/Mauritius": [
			"3:50 - LMT 1907 3:50",
			"4 Mauritius MU%sT"
		],
		"Indian/Mayotte": [
			"3:0:56 - LMT 1911_6 3:0:56",
			"3 - EAT"
		],
		"Indian/Reunion": [
			"3:41:52 - LMT 1911_5 3:41:52",
			"4 - RET"
		],
		"Pacific/Apia": [
			"12:33:4 - LMT 1879_6_5 12:33:4",
			"-11:26:56 - LMT 1911 -11:26:56",
			"-11:30 - SAMT 1950 -11:30",
			"-11 - WST 2010_8_26 -11",
			"-10 - WSDT 2011_3_2_4 -10",
			"-11 - WST 2011_8_24_3 -11",
			"-10 - WSDT 2011_11_30 -10",
			"14 - WSDT 2012_3_1_4 14",
			"13 WS WS%sT"
		],
		"Pacific/Auckland": [
			"11:39:4 - LMT 1868_10_2 11:39:4",
			"11:30 NZ NZ%sT 1946_0_1 12",
			"12 NZ NZ%sT"
		],
		"Pacific/Chatham": [
			"12:13:48 - LMT 1957_0_1 12:13:48",
			"12:45 Chatham CHA%sT"
		],
		"Pacific/Chuuk": [
			"10:7:8 - LMT 1901 10:7:8",
			"10 - CHUT"
		],
		"Pacific/Easter": [
			"-7:17:44 - LMT 1890 -7:17:44",
			"-7:17:28 - EMT 1932_8 -7:17:28",
			"-7 Chile EAS%sT 1982_2_13_21 -6",
			"-6 Chile EAS%sT"
		],
		"Pacific/Efate": [
			"11:13:16 - LMT 1912_0_13 11:13:16",
			"11 Vanuatu VU%sT"
		],
		"Pacific/Enderbury": [
			"-11:24:20 - LMT 1901 -11:24:20",
			"-12 - PHOT 1979_9 -12",
			"-11 - PHOT 1995 -11",
			"13 - PHOT"
		],
		"Pacific/Fakaofo": [
			"-11:24:56 - LMT 1901 -11:24:56",
			"-11 - TKT 2011_11_30 -11",
			"13 - TKT"
		],
		"Pacific/Fiji": [
			"11:55:44 - LMT 1915_9_26 11:55:44",
			"12 Fiji FJ%sT"
		],
		"Pacific/Funafuti": [
			"11:56:52 - LMT 1901 11:56:52",
			"12 - TVT"
		],
		"Pacific/Galapagos": [
			"-5:58:24 - LMT 1931 -5:58:24",
			"-5 - ECT 1986 -5",
			"-6 - GALT"
		],
		"Pacific/Gambier": [
			"-8:59:48 - LMT 1912_9 -8:59:48",
			"-9 - GAMT"
		],
		"Pacific/Guadalcanal": [
			"10:39:48 - LMT 1912_9 10:39:48",
			"11 - SBT"
		],
		"Pacific/Guam": [
			"-14:21 - LMT 1844_11_31 -14:21",
			"9:39 - LMT 1901 9:39",
			"10 - GST 2000_11_23 10",
			"10 - ChST"
		],
		"Pacific/Honolulu": [
			"-10:31:26 - LMT 1896_0_13_12 -10:31:26",
			"-10:30 - HST 1933_3_30_2 -10:30",
			"-9:30 - HDT 1933_4_21_12 -9:30",
			"-10:30 - HST 1942_1_09_2 -10:30",
			"-9:30 - HDT 1945_8_30_2 -9:30",
			"-10:30 - HST 1947_5_8_2 -10:30",
			"-10 - HST"
		],
		"Pacific/Johnston": [
			"-10 - HST"
		],
		"Pacific/Kiritimati": [
			"-10:29:20 - LMT 1901 -10:29:20",
			"-10:40 - LINT 1979_9 -10:40",
			"-10 - LINT 1995 -10",
			"14 - LINT"
		],
		"Pacific/Kosrae": [
			"10:51:56 - LMT 1901 10:51:56",
			"11 - KOST 1969_9 11",
			"12 - KOST 1999 12",
			"11 - KOST"
		],
		"Pacific/Kwajalein": [
			"11:9:20 - LMT 1901 11:9:20",
			"11 - MHT 1969_9 11",
			"-12 - KWAT 1993_7_20 -12",
			"12 - MHT"
		],
		"Pacific/Majuro": [
			"11:24:48 - LMT 1901 11:24:48",
			"11 - MHT 1969_9 11",
			"12 - MHT"
		],
		"Pacific/Marquesas": [
			"-9:18 - LMT 1912_9 -9:18",
			"-9:30 - MART"
		],
		"Pacific/Midway": [
			"-11:49:28 - LMT 1901 -11:49:28",
			"-11 - NST 1956_5_3 -11",
			"-10 - NDT 1956_8_2 -10",
			"-11 - NST 1967_3 -11",
			"-11 - BST 1983_10_30 -11",
			"-11 - SST"
		],
		"Pacific/Nauru": [
			"11:7:40 - LMT 1921_0_15 11:7:40",
			"11:30 - NRT 1942_2_15 11:30",
			"9 - JST 1944_7_15 9",
			"11:30 - NRT 1979_4 11:30",
			"12 - NRT"
		],
		"Pacific/Niue": [
			"-11:19:40 - LMT 1901 -11:19:40",
			"-11:20 - NUT 1951 -11:20",
			"-11:30 - NUT 1978_9_1 -11:30",
			"-11 - NUT"
		],
		"Pacific/Norfolk": [
			"11:11:52 - LMT 1901 11:11:52",
			"11:12 - NMT 1951 11:12",
			"11:30 - NFT"
		],
		"Pacific/Noumea": [
			"11:5:48 - LMT 1912_0_13 11:5:48",
			"11 NC NC%sT"
		],
		"Pacific/Pago_Pago": [
			"12:37:12 - LMT 1879_6_5 12:37:12",
			"-11:22:48 - LMT 1911 -11:22:48",
			"-11:30 - SAMT 1950 -11:30",
			"-11 - NST 1967_3 -11",
			"-11 - BST 1983_10_30 -11",
			"-11 - SST"
		],
		"Pacific/Palau": [
			"8:57:56 - LMT 1901 8:57:56",
			"9 - PWT"
		],
		"Pacific/Pitcairn": [
			"-8:40:20 - LMT 1901 -8:40:20",
			"-8:30 - PNT 1998_3_27_00 -8:30",
			"-8 - PST"
		],
		"Pacific/Pohnpei": [
			"10:32:52 - LMT 1901 10:32:52",
			"11 - PONT"
		],
		"Pacific/Port_Moresby": [
			"9:48:40 - LMT 1880 9:48:40",
			"9:48:32 - PMMT 1895 9:48:32",
			"10 - PGT"
		],
		"Pacific/Rarotonga": [
			"-10:39:4 - LMT 1901 -10:39:4",
			"-10:30 - CKT 1978_10_12 -10:30",
			"-10 Cook CK%sT"
		],
		"Pacific/Saipan": [
			"-14:17 - LMT 1844_11_31 -14:17",
			"9:43 - LMT 1901 9:43",
			"9 - MPT 1969_9 9",
			"10 - MPT 2000_11_23 10",
			"10 - ChST"
		],
		"Pacific/Tahiti": [
			"-9:58:16 - LMT 1912_9 -9:58:16",
			"-10 - TAHT"
		],
		"Pacific/Tarawa": [
			"11:32:4 - LMT 1901 11:32:4",
			"12 - GILT"
		],
		"Pacific/Tongatapu": [
			"12:19:20 - LMT 1901 12:19:20",
			"12:20 - TOT 1941 12:20",
			"13 - TOT 1999 13",
			"13 Tonga TO%sT"
		],
		"Pacific/Wake": [
			"11:6:28 - LMT 1901 11:6:28",
			"12 - WAKT"
		],
		"Pacific/Wallis": [
			"12:15:20 - LMT 1901 12:15:20",
			"12 - WFT"
		]
	},
	"rules": {
		"Ghana": [
			"1936 1942 8 1 7 0 0 0:20 GHST",
			"1936 1942 11 31 7 0 0 0 GMT"
		],
		"Algeria": [
			"1916 1916 5 14 7 23 2 1 S",
			"1916 1919 9 1 0 23 2 0",
			"1917 1917 2 24 7 23 2 1 S",
			"1918 1918 2 9 7 23 2 1 S",
			"1919 1919 2 1 7 23 2 1 S",
			"1920 1920 1 14 7 23 2 1 S",
			"1920 1920 9 23 7 23 2 0",
			"1921 1921 2 14 7 23 2 1 S",
			"1921 1921 5 21 7 23 2 0",
			"1939 1939 8 11 7 23 2 1 S",
			"1939 1939 10 19 7 1 0 0",
			"1944 1945 3 1 1 2 0 1 S",
			"1944 1944 9 8 7 2 0 0",
			"1945 1945 8 16 7 1 0 0",
			"1971 1971 3 25 7 23 2 1 S",
			"1971 1971 8 26 7 23 2 0",
			"1977 1977 4 6 7 0 0 1 S",
			"1977 1977 9 21 7 0 0 0",
			"1978 1978 2 24 7 1 0 1 S",
			"1978 1978 8 22 7 3 0 0",
			"1980 1980 3 25 7 0 0 1 S",
			"1980 1980 9 31 7 2 0 0"
		],
		"Egypt": [
			"1940 1940 6 15 7 0 0 1 S",
			"1940 1940 9 1 7 0 0 0",
			"1941 1941 3 15 7 0 0 1 S",
			"1941 1941 8 16 7 0 0 0",
			"1942 1944 3 1 7 0 0 1 S",
			"1942 1942 9 27 7 0 0 0",
			"1943 1945 10 1 7 0 0 0",
			"1945 1945 3 16 7 0 0 1 S",
			"1957 1957 4 10 7 0 0 1 S",
			"1957 1958 9 1 7 0 0 0",
			"1958 1958 4 1 7 0 0 1 S",
			"1959 1981 4 1 7 1 0 1 S",
			"1959 1965 8 30 7 3 0 0",
			"1966 1994 9 1 7 3 0 0",
			"1982 1982 6 25 7 1 0 1 S",
			"1983 1983 6 12 7 1 0 1 S",
			"1984 1988 4 1 7 1 0 1 S",
			"1989 1989 4 6 7 1 0 1 S",
			"1990 1994 4 1 7 1 0 1 S",
			"1995 2010 3 5 8 0 2 1 S",
			"1995 2005 8 4 8 23 2 0",
			"2006 2006 8 21 7 23 2 0",
			"2007 2007 8 1 4 23 2 0",
			"2008 2008 7 4 8 23 2 0",
			"2009 2009 7 20 7 23 2 0",
			"2010 2010 7 11 7 0 0 0",
			"2010 2010 8 10 7 0 0 1 S",
			"2010 2010 8 4 8 23 2 0"
		],
		"Morocco": [
			"1939 1939 8 12 7 0 0 1 S",
			"1939 1939 10 19 7 0 0 0",
			"1940 1940 1 25 7 0 0 1 S",
			"1945 1945 10 18 7 0 0 0",
			"1950 1950 5 11 7 0 0 1 S",
			"1950 1950 9 29 7 0 0 0",
			"1967 1967 5 3 7 12 0 1 S",
			"1967 1967 9 1 7 0 0 0",
			"1974 1974 5 24 7 0 0 1 S",
			"1974 1974 8 1 7 0 0 0",
			"1976 1977 4 1 7 0 0 1 S",
			"1976 1976 7 1 7 0 0 0",
			"1977 1977 8 28 7 0 0 0",
			"1978 1978 5 1 7 0 0 1 S",
			"1978 1978 7 4 7 0 0 0",
			"2008 2008 5 1 7 0 0 1 S",
			"2008 2008 8 1 7 0 0 0",
			"2009 2009 5 1 7 0 0 1 S",
			"2009 2009 7 21 7 0 0 0",
			"2010 2010 4 2 7 0 0 1 S",
			"2010 2010 7 8 7 0 0 0",
			"2011 2011 3 3 7 0 0 1 S",
			"2011 2011 6 31 7 0 0 0",
			"2012 2019 3 0 8 2 0 1 S",
			"2012 9999 8 0 8 3 0 0",
			"2012 2012 6 20 7 3 0 0",
			"2012 2012 7 20 7 2 0 1 S",
			"2013 2013 6 9 7 3 0 0",
			"2013 2013 7 8 7 2 0 1 S",
			"2014 2014 5 29 7 3 0 0",
			"2014 2014 6 29 7 2 0 1 S",
			"2015 2015 5 18 7 3 0 0",
			"2015 2015 6 18 7 2 0 1 S",
			"2016 2016 5 7 7 3 0 0",
			"2016 2016 6 7 7 2 0 1 S",
			"2017 2017 4 27 7 3 0 0",
			"2017 2017 5 26 7 2 0 1 S",
			"2018 2018 4 16 7 3 0 0",
			"2018 2018 5 15 7 2 0 1 S",
			"2019 2019 4 6 7 3 0 0",
			"2019 2019 5 5 7 2 0 1 S",
			"2020 2020 4 24 7 2 0 1 S",
			"2021 2021 4 13 7 2 0 1 S",
			"2022 2022 4 3 7 2 0 1 S",
			"2023 9999 3 0 8 2 0 1 S"
		],
		"Spain": [
			"1917 1917 4 5 7 23 2 1 S",
			"1917 1919 9 6 7 23 2 0",
			"1918 1918 3 15 7 23 2 1 S",
			"1919 1919 3 5 7 23 2 1 S",
			"1924 1924 3 16 7 23 2 1 S",
			"1924 1924 9 4 7 23 2 0",
			"1926 1926 3 17 7 23 2 1 S",
			"1926 1929 9 1 6 23 2 0",
			"1927 1927 3 9 7 23 2 1 S",
			"1928 1928 3 14 7 23 2 1 S",
			"1929 1929 3 20 7 23 2 1 S",
			"1937 1937 4 22 7 23 2 1 S",
			"1937 1939 9 1 6 23 2 0",
			"1938 1938 2 22 7 23 2 1 S",
			"1939 1939 3 15 7 23 2 1 S",
			"1940 1940 2 16 7 23 2 1 S",
			"1942 1942 4 2 7 22 2 2 M",
			"1942 1942 8 1 7 22 2 1 S",
			"1943 1946 3 13 6 22 2 2 M",
			"1943 1943 9 3 7 22 2 1 S",
			"1944 1944 9 10 7 22 2 1 S",
			"1945 1945 8 30 7 1 0 1 S",
			"1946 1946 8 30 7 0 0 0",
			"1949 1949 3 30 7 23 0 1 S",
			"1949 1949 8 30 7 1 0 0",
			"1974 1975 3 13 6 23 0 1 S",
			"1974 1975 9 1 0 1 0 0",
			"1976 1976 2 27 7 23 0 1 S",
			"1976 1977 8 0 8 1 0 0",
			"1977 1978 3 2 7 23 0 1 S",
			"1978 1978 9 1 7 1 0 0"
		],
		"SpainAfrica": [
			"1967 1967 5 3 7 12 0 1 S",
			"1967 1967 9 1 7 0 0 0",
			"1974 1974 5 24 7 0 0 1 S",
			"1974 1974 8 1 7 0 0 0",
			"1976 1977 4 1 7 0 0 1 S",
			"1976 1976 7 1 7 0 0 0",
			"1977 1977 8 28 7 0 0 0",
			"1978 1978 5 1 7 0 0 1 S",
			"1978 1978 7 4 7 0 0 0"
		],
		"EU": [
			"1977 1980 3 1 0 1 1 1 S",
			"1977 1977 8 0 8 1 1 0",
			"1978 1978 9 1 7 1 1 0",
			"1979 1995 8 0 8 1 1 0",
			"1981 9999 2 0 8 1 1 1 S",
			"1996 9999 9 0 8 1 1 0"
		],
		"SL": [
			"1935 1942 5 1 7 0 0 0:40 SLST",
			"1935 1942 9 1 7 0 0 0 WAT",
			"1957 1962 5 1 7 0 0 1 SLST",
			"1957 1962 8 1 7 0 0 0 GMT"
		],
		"SA": [
			"1942 1943 8 15 0 2 0 1",
			"1943 1944 2 15 0 2 0 0"
		],
		"Sudan": [
			"1970 1970 4 1 7 0 0 1 S",
			"1970 1985 9 15 7 0 0 0",
			"1971 1971 3 30 7 0 0 1 S",
			"1972 1985 3 0 8 0 0 1 S"
		],
		"Libya": [
			"1951 1951 9 14 7 2 0 1 S",
			"1952 1952 0 1 7 0 0 0",
			"1953 1953 9 9 7 2 0 1 S",
			"1954 1954 0 1 7 0 0 0",
			"1955 1955 8 30 7 0 0 1 S",
			"1956 1956 0 1 7 0 0 0",
			"1982 1984 3 1 7 0 0 1 S",
			"1982 1985 9 1 7 0 0 0",
			"1985 1985 3 6 7 0 0 1 S",
			"1986 1986 3 4 7 0 0 1 S",
			"1986 1986 9 3 7 0 0 0",
			"1987 1989 3 1 7 0 0 1 S",
			"1987 1989 9 1 7 0 0 0",
			"1997 1997 3 4 7 0 0 1 S",
			"1997 1997 9 4 7 0 0 0",
			"2013 9999 2 5 8 1 0 1 S",
			"2013 9999 9 5 8 2 0 0"
		],
		"Tunisia": [
			"1939 1939 3 15 7 23 2 1 S",
			"1939 1939 10 18 7 23 2 0",
			"1940 1940 1 25 7 23 2 1 S",
			"1941 1941 9 6 7 0 0 0",
			"1942 1942 2 9 7 0 0 1 S",
			"1942 1942 10 2 7 3 0 0",
			"1943 1943 2 29 7 2 0 1 S",
			"1943 1943 3 17 7 2 0 0",
			"1943 1943 3 25 7 2 0 1 S",
			"1943 1943 9 4 7 2 0 0",
			"1944 1945 3 1 1 2 0 1 S",
			"1944 1944 9 8 7 0 0 0",
			"1945 1945 8 16 7 0 0 0",
			"1977 1977 3 30 7 0 2 1 S",
			"1977 1977 8 24 7 0 2 0",
			"1978 1978 4 1 7 0 2 1 S",
			"1978 1978 9 1 7 0 2 0",
			"1988 1988 5 1 7 0 2 1 S",
			"1988 1990 8 0 8 0 2 0",
			"1989 1989 2 26 7 0 2 1 S",
			"1990 1990 4 1 7 0 2 1 S",
			"2005 2005 4 1 7 0 2 1 S",
			"2005 2005 8 30 7 1 2 0",
			"2006 2008 2 0 8 2 2 1 S",
			"2006 2008 9 0 8 2 2 0"
		],
		"Namibia": [
			"1994 9999 8 1 0 2 0 1 S",
			"1995 9999 3 1 0 2 0 0"
		],
		"US": [
			"1918 1919 2 0 8 2 0 1 D",
			"1918 1919 9 0 8 2 0 0 S",
			"1942 1942 1 9 7 2 0 1 W",
			"1945 1945 7 14 7 23 1 1 P",
			"1945 1945 8 30 7 2 0 0 S",
			"1967 2006 9 0 8 2 0 0 S",
			"1967 1973 3 0 8 2 0 1 D",
			"1974 1974 0 6 7 2 0 1 D",
			"1975 1975 1 23 7 2 0 1 D",
			"1976 1986 3 0 8 2 0 1 D",
			"1987 2006 3 1 0 2 0 1 D",
			"2007 9999 2 8 0 2 0 1 D",
			"2007 9999 10 1 0 2 0 0 S"
		],
		"Brazil": [
			"1931 1931 9 3 7 11 0 1 S",
			"1932 1933 3 1 7 0 0 0",
			"1932 1932 9 3 7 0 0 1 S",
			"1949 1952 11 1 7 0 0 1 S",
			"1950 1950 3 16 7 1 0 0",
			"1951 1952 3 1 7 0 0 0",
			"1953 1953 2 1 7 0 0 0",
			"1963 1963 11 9 7 0 0 1 S",
			"1964 1964 2 1 7 0 0 0",
			"1965 1965 0 31 7 0 0 1 S",
			"1965 1965 2 31 7 0 0 0",
			"1965 1965 11 1 7 0 0 1 S",
			"1966 1968 2 1 7 0 0 0",
			"1966 1967 10 1 7 0 0 1 S",
			"1985 1985 10 2 7 0 0 1 S",
			"1986 1986 2 15 7 0 0 0",
			"1986 1986 9 25 7 0 0 1 S",
			"1987 1987 1 14 7 0 0 0",
			"1987 1987 9 25 7 0 0 1 S",
			"1988 1988 1 7 7 0 0 0",
			"1988 1988 9 16 7 0 0 1 S",
			"1989 1989 0 29 7 0 0 0",
			"1989 1989 9 15 7 0 0 1 S",
			"1990 1990 1 11 7 0 0 0",
			"1990 1990 9 21 7 0 0 1 S",
			"1991 1991 1 17 7 0 0 0",
			"1991 1991 9 20 7 0 0 1 S",
			"1992 1992 1 9 7 0 0 0",
			"1992 1992 9 25 7 0 0 1 S",
			"1993 1993 0 31 7 0 0 0",
			"1993 1995 9 11 0 0 0 1 S",
			"1994 1995 1 15 0 0 0 0",
			"1996 1996 1 11 7 0 0 0",
			"1996 1996 9 6 7 0 0 1 S",
			"1997 1997 1 16 7 0 0 0",
			"1997 1997 9 6 7 0 0 1 S",
			"1998 1998 2 1 7 0 0 0",
			"1998 1998 9 11 7 0 0 1 S",
			"1999 1999 1 21 7 0 0 0",
			"1999 1999 9 3 7 0 0 1 S",
			"2000 2000 1 27 7 0 0 0",
			"2000 2001 9 8 0 0 0 1 S",
			"2001 2006 1 15 0 0 0 0",
			"2002 2002 10 3 7 0 0 1 S",
			"2003 2003 9 19 7 0 0 1 S",
			"2004 2004 10 2 7 0 0 1 S",
			"2005 2005 9 16 7 0 0 1 S",
			"2006 2006 10 5 7 0 0 1 S",
			"2007 2007 1 25 7 0 0 0",
			"2007 2007 9 8 0 0 0 1 S",
			"2008 9999 9 15 0 0 0 1 S",
			"2008 2011 1 15 0 0 0 0",
			"2012 2012 1 22 0 0 0 0",
			"2013 2014 1 15 0 0 0 0",
			"2015 2015 1 22 0 0 0 0",
			"2016 2022 1 15 0 0 0 0",
			"2023 2023 1 22 0 0 0 0",
			"2024 2025 1 15 0 0 0 0",
			"2026 2026 1 22 0 0 0 0",
			"2027 2033 1 15 0 0 0 0",
			"2034 2034 1 22 0 0 0 0",
			"2035 2036 1 15 0 0 0 0",
			"2037 2037 1 22 0 0 0 0",
			"2038 9999 1 15 0 0 0 0"
		],
		"Arg": [
			"1930 1930 11 1 7 0 0 1 S",
			"1931 1931 3 1 7 0 0 0",
			"1931 1931 9 15 7 0 0 1 S",
			"1932 1940 2 1 7 0 0 0",
			"1932 1939 10 1 7 0 0 1 S",
			"1940 1940 6 1 7 0 0 1 S",
			"1941 1941 5 15 7 0 0 0",
			"1941 1941 9 15 7 0 0 1 S",
			"1943 1943 7 1 7 0 0 0",
			"1943 1943 9 15 7 0 0 1 S",
			"1946 1946 2 1 7 0 0 0",
			"1946 1946 9 1 7 0 0 1 S",
			"1963 1963 9 1 7 0 0 0",
			"1963 1963 11 15 7 0 0 1 S",
			"1964 1966 2 1 7 0 0 0",
			"1964 1966 9 15 7 0 0 1 S",
			"1967 1967 3 2 7 0 0 0",
			"1967 1968 9 1 0 0 0 1 S",
			"1968 1969 3 1 0 0 0 0",
			"1974 1974 0 23 7 0 0 1 S",
			"1974 1974 4 1 7 0 0 0",
			"1988 1988 11 1 7 0 0 1 S",
			"1989 1993 2 1 0 0 0 0",
			"1989 1992 9 15 0 0 0 1 S",
			"1999 1999 9 1 0 0 0 1 S",
			"2000 2000 2 3 7 0 0 0",
			"2007 2007 11 30 7 0 0 1 S",
			"2008 2009 2 15 0 0 0 0",
			"2008 2008 9 15 0 0 0 1 S"
		],
		"SanLuis": [
			"2008 2009 2 8 0 0 0 0",
			"2007 2009 9 8 0 0 0 1 S"
		],
		"Para": [
			"1975 1988 9 1 7 0 0 1 S",
			"1975 1978 2 1 7 0 0 0",
			"1979 1991 3 1 7 0 0 0",
			"1989 1989 9 22 7 0 0 1 S",
			"1990 1990 9 1 7 0 0 1 S",
			"1991 1991 9 6 7 0 0 1 S",
			"1992 1992 2 1 7 0 0 0",
			"1992 1992 9 5 7 0 0 1 S",
			"1993 1993 2 31 7 0 0 0",
			"1993 1995 9 1 7 0 0 1 S",
			"1994 1995 1 0 8 0 0 0",
			"1996 1996 2 1 7 0 0 0",
			"1996 2001 9 1 0 0 0 1 S",
			"1997 1997 1 0 8 0 0 0",
			"1998 2001 2 1 0 0 0 0",
			"2002 2004 3 1 0 0 0 0",
			"2002 2003 8 1 0 0 0 1 S",
			"2004 2009 9 15 0 0 0 1 S",
			"2005 2009 2 8 0 0 0 0",
			"2010 9999 9 1 0 0 0 1 S",
			"2010 2012 3 8 0 0 0 0",
			"2013 9999 2 22 0 0 0 0"
		],
		"Canada": [
			"1918 1918 3 14 7 2 0 1 D",
			"1918 1918 9 27 7 2 0 0 S",
			"1942 1942 1 9 7 2 0 1 W",
			"1945 1945 7 14 7 23 1 1 P",
			"1945 1945 8 30 7 2 0 0 S",
			"1974 1986 3 0 8 2 0 1 D",
			"1974 2006 9 0 8 2 0 0 S",
			"1987 2006 3 1 0 2 0 1 D",
			"2007 9999 2 8 0 2 0 1 D",
			"2007 9999 10 1 0 2 0 0 S"
		],
		"Mexico": [
			"1939 1939 1 5 7 0 0 1 D",
			"1939 1939 5 25 7 0 0 0 S",
			"1940 1940 11 9 7 0 0 1 D",
			"1941 1941 3 1 7 0 0 0 S",
			"1943 1943 11 16 7 0 0 1 W",
			"1944 1944 4 1 7 0 0 0 S",
			"1950 1950 1 12 7 0 0 1 D",
			"1950 1950 6 30 7 0 0 0 S",
			"1996 2000 3 1 0 2 0 1 D",
			"1996 2000 9 0 8 2 0 0 S",
			"2001 2001 4 1 0 2 0 1 D",
			"2001 2001 8 0 8 2 0 0 S",
			"2002 9999 3 1 0 2 0 1 D",
			"2002 9999 9 0 8 2 0 0 S"
		],
		"Barb": [
			"1977 1977 5 12 7 2 0 1 D",
			"1977 1978 9 1 0 2 0 0 S",
			"1978 1980 3 15 0 2 0 1 D",
			"1979 1979 8 30 7 2 0 0 S",
			"1980 1980 8 25 7 2 0 0 S"
		],
		"Belize": [
			"1918 1942 9 2 0 0 0 0:30 HD",
			"1919 1943 1 9 0 0 0 0 S",
			"1973 1973 11 5 7 0 0 1 D",
			"1974 1974 1 9 7 0 0 0 S",
			"1982 1982 11 18 7 0 0 1 D",
			"1983 1983 1 12 7 0 0 0 S"
		],
		"CO": [
			"1992 1992 4 3 7 0 0 1 S",
			"1993 1993 3 4 7 0 0 0"
		],
		"NT_YK": [
			"1918 1918 3 14 7 2 0 1 D",
			"1918 1918 9 27 7 2 0 0 S",
			"1919 1919 4 25 7 2 0 1 D",
			"1919 1919 10 1 7 0 0 0 S",
			"1942 1942 1 9 7 2 0 1 W",
			"1945 1945 7 14 7 23 1 1 P",
			"1945 1945 8 30 7 2 0 0 S",
			"1965 1965 3 0 8 0 0 2 DD",
			"1965 1965 9 0 8 2 0 0 S",
			"1980 1986 3 0 8 2 0 1 D",
			"1980 2006 9 0 8 2 0 0 S",
			"1987 2006 3 1 0 2 0 1 D"
		],
		"Chicago": [
			"1920 1920 5 13 7 2 0 1 D",
			"1920 1921 9 0 8 2 0 0 S",
			"1921 1921 2 0 8 2 0 1 D",
			"1922 1966 3 0 8 2 0 1 D",
			"1922 1954 8 0 8 2 0 0 S",
			"1955 1966 9 0 8 2 0 0 S"
		],
		"CR": [
			"1979 1980 1 0 8 0 0 1 D",
			"1979 1980 5 1 0 0 0 0 S",
			"1991 1992 0 15 6 0 0 1 D",
			"1991 1991 6 1 7 0 0 0 S",
			"1992 1992 2 15 7 0 0 0 S"
		],
		"Vanc": [
			"1918 1918 3 14 7 2 0 1 D",
			"1918 1918 9 27 7 2 0 0 S",
			"1942 1942 1 9 7 2 0 1 W",
			"1945 1945 7 14 7 23 1 1 P",
			"1945 1945 8 30 7 2 0 0 S",
			"1946 1986 3 0 8 2 0 1 D",
			"1946 1946 9 13 7 2 0 0 S",
			"1947 1961 8 0 8 2 0 0 S",
			"1962 2006 9 0 8 2 0 0 S"
		],
		"Denver": [
			"1920 1921 2 0 8 2 0 1 D",
			"1920 1920 9 0 8 2 0 0 S",
			"1921 1921 4 22 7 2 0 0 S",
			"1965 1966 3 0 8 2 0 1 D",
			"1965 1966 9 0 8 2 0 0 S"
		],
		"Detroit": [
			"1948 1948 3 0 8 2 0 1 D",
			"1948 1948 8 0 8 2 0 0 S",
			"1967 1967 5 14 7 2 0 1 D",
			"1967 1967 9 0 8 2 0 0 S"
		],
		"Edm": [
			"1918 1919 3 8 0 2 0 1 D",
			"1918 1918 9 27 7 2 0 0 S",
			"1919 1919 4 27 7 2 0 0 S",
			"1920 1923 3 0 8 2 0 1 D",
			"1920 1920 9 0 8 2 0 0 S",
			"1921 1923 8 0 8 2 0 0 S",
			"1942 1942 1 9 7 2 0 1 W",
			"1945 1945 7 14 7 23 1 1 P",
			"1945 1945 8 0 8 2 0 0 S",
			"1947 1947 3 0 8 2 0 1 D",
			"1947 1947 8 0 8 2 0 0 S",
			"1967 1967 3 0 8 2 0 1 D",
			"1967 1967 9 0 8 2 0 0 S",
			"1969 1969 3 0 8 2 0 1 D",
			"1969 1969 9 0 8 2 0 0 S",
			"1972 1986 3 0 8 2 0 1 D",
			"1972 2006 9 0 8 2 0 0 S"
		],
		"Salv": [
			"1987 1988 4 1 0 0 0 1 D",
			"1987 1988 8 0 8 0 0 0 S"
		],
		"Halifax": [
			"1916 1916 3 1 7 0 0 1 D",
			"1916 1916 9 1 7 0 0 0 S",
			"1920 1920 4 9 7 0 0 1 D",
			"1920 1920 7 29 7 0 0 0 S",
			"1921 1921 4 6 7 0 0 1 D",
			"1921 1922 8 5 7 0 0 0 S",
			"1922 1922 3 30 7 0 0 1 D",
			"1923 1925 4 1 0 0 0 1 D",
			"1923 1923 8 4 7 0 0 0 S",
			"1924 1924 8 15 7 0 0 0 S",
			"1925 1925 8 28 7 0 0 0 S",
			"1926 1926 4 16 7 0 0 1 D",
			"1926 1926 8 13 7 0 0 0 S",
			"1927 1927 4 1 7 0 0 1 D",
			"1927 1927 8 26 7 0 0 0 S",
			"1928 1931 4 8 0 0 0 1 D",
			"1928 1928 8 9 7 0 0 0 S",
			"1929 1929 8 3 7 0 0 0 S",
			"1930 1930 8 15 7 0 0 0 S",
			"1931 1932 8 24 1 0 0 0 S",
			"1932 1932 4 1 7 0 0 1 D",
			"1933 1933 3 30 7 0 0 1 D",
			"1933 1933 9 2 7 0 0 0 S",
			"1934 1934 4 20 7 0 0 1 D",
			"1934 1934 8 16 7 0 0 0 S",
			"1935 1935 5 2 7 0 0 1 D",
			"1935 1935 8 30 7 0 0 0 S",
			"1936 1936 5 1 7 0 0 1 D",
			"1936 1936 8 14 7 0 0 0 S",
			"1937 1938 4 1 0 0 0 1 D",
			"1937 1941 8 24 1 0 0 0 S",
			"1939 1939 4 28 7 0 0 1 D",
			"1940 1941 4 1 0 0 0 1 D",
			"1946 1949 3 0 8 2 0 1 D",
			"1946 1949 8 0 8 2 0 0 S",
			"1951 1954 3 0 8 2 0 1 D",
			"1951 1954 8 0 8 2 0 0 S",
			"1956 1959 3 0 8 2 0 1 D",
			"1956 1959 8 0 8 2 0 0 S",
			"1962 1973 3 0 8 2 0 1 D",
			"1962 1973 9 0 8 2 0 0 S"
		],
		"StJohns": [
			"1917 1917 3 8 7 2 0 1 D",
			"1917 1917 8 17 7 2 0 0 S",
			"1919 1919 4 5 7 23 0 1 D",
			"1919 1919 7 12 7 23 0 0 S",
			"1920 1935 4 1 0 23 0 1 D",
			"1920 1935 9 0 8 23 0 0 S",
			"1936 1941 4 9 1 0 0 1 D",
			"1936 1941 9 2 1 0 0 0 S",
			"1946 1950 4 8 0 2 0 1 D",
			"1946 1950 9 2 0 2 0 0 S",
			"1951 1986 3 0 8 2 0 1 D",
			"1951 1959 8 0 8 2 0 0 S",
			"1960 1986 9 0 8 2 0 0 S",
			"1987 1987 3 1 0 0:1 0 1 D",
			"1987 2006 9 0 8 0:1 0 0 S",
			"1988 1988 3 1 0 0:1 0 2 DD",
			"1989 2006 3 1 0 0:1 0 1 D",
			"2007 2011 2 8 0 0:1 0 1 D",
			"2007 2010 10 1 0 0:1 0 0 S"
		],
		"TC": [
			"1979 1986 3 0 8 2 0 1 D",
			"1979 2006 9 0 8 2 0 0 S",
			"1987 2006 3 1 0 2 0 1 D",
			"2007 9999 2 8 0 2 0 1 D",
			"2007 9999 10 1 0 2 0 0 S"
		],
		"Guat": [
			"1973 1973 10 25 7 0 0 1 D",
			"1974 1974 1 24 7 0 0 0 S",
			"1983 1983 4 21 7 0 0 1 D",
			"1983 1983 8 22 7 0 0 0 S",
			"1991 1991 2 23 7 0 0 1 D",
			"1991 1991 8 7 7 0 0 0 S",
			"2006 2006 3 30 7 0 0 1 D",
			"2006 2006 9 1 7 0 0 0 S"
		],
		"Cuba": [
			"1928 1928 5 10 7 0 0 1 D",
			"1928 1928 9 10 7 0 0 0 S",
			"1940 1942 5 1 0 0 0 1 D",
			"1940 1942 8 1 0 0 0 0 S",
			"1945 1946 5 1 0 0 0 1 D",
			"1945 1946 8 1 0 0 0 0 S",
			"1965 1965 5 1 7 0 0 1 D",
			"1965 1965 8 30 7 0 0 0 S",
			"1966 1966 4 29 7 0 0 1 D",
			"1966 1966 9 2 7 0 0 0 S",
			"1967 1967 3 8 7 0 0 1 D",
			"1967 1968 8 8 0 0 0 0 S",
			"1968 1968 3 14 7 0 0 1 D",
			"1969 1977 3 0 8 0 0 1 D",
			"1969 1971 9 0 8 0 0 0 S",
			"1972 1974 9 8 7 0 0 0 S",
			"1975 1977 9 0 8 0 0 0 S",
			"1978 1978 4 7 7 0 0 1 D",
			"1978 1990 9 8 0 0 0 0 S",
			"1979 1980 2 15 0 0 0 1 D",
			"1981 1985 4 5 0 0 0 1 D",
			"1986 1989 2 14 0 0 0 1 D",
			"1990 1997 3 1 0 0 0 1 D",
			"1991 1995 9 8 0 0 2 0 S",
			"1996 1996 9 6 7 0 2 0 S",
			"1997 1997 9 12 7 0 2 0 S",
			"1998 1999 2 0 8 0 2 1 D",
			"1998 2003 9 0 8 0 2 0 S",
			"2000 2004 3 1 0 0 2 1 D",
			"2006 2010 9 0 8 0 2 0 S",
			"2007 2007 2 8 0 0 2 1 D",
			"2008 2008 2 15 0 0 2 1 D",
			"2009 2010 2 8 0 0 2 1 D",
			"2011 2011 2 15 0 0 2 1 D",
			"2011 2011 10 13 7 0 2 0 S",
			"2012 2012 3 1 7 0 2 1 D",
			"2012 9999 10 1 0 0 2 0 S",
			"2013 9999 2 8 0 0 2 1 D"
		],
		"Indianapolis": [
			"1941 1941 5 22 7 2 0 1 D",
			"1941 1954 8 0 8 2 0 0 S",
			"1946 1954 3 0 8 2 0 1 D"
		],
		"Starke": [
			"1947 1961 3 0 8 2 0 1 D",
			"1947 1954 8 0 8 2 0 0 S",
			"1955 1956 9 0 8 2 0 0 S",
			"1957 1958 8 0 8 2 0 0 S",
			"1959 1961 9 0 8 2 0 0 S"
		],
		"Marengo": [
			"1951 1951 3 0 8 2 0 1 D",
			"1951 1951 8 0 8 2 0 0 S",
			"1954 1960 3 0 8 2 0 1 D",
			"1954 1960 8 0 8 2 0 0 S"
		],
		"Pike": [
			"1955 1955 4 1 7 0 0 1 D",
			"1955 1960 8 0 8 2 0 0 S",
			"1956 1964 3 0 8 2 0 1 D",
			"1961 1964 9 0 8 2 0 0 S"
		],
		"Perry": [
			"1946 1946 3 0 8 2 0 1 D",
			"1946 1946 8 0 8 2 0 0 S",
			"1953 1954 3 0 8 2 0 1 D",
			"1953 1959 8 0 8 2 0 0 S",
			"1955 1955 4 1 7 0 0 1 D",
			"1956 1963 3 0 8 2 0 1 D",
			"1960 1960 9 0 8 2 0 0 S",
			"1961 1961 8 0 8 2 0 0 S",
			"1962 1963 9 0 8 2 0 0 S"
		],
		"Vincennes": [
			"1946 1946 3 0 8 2 0 1 D",
			"1946 1946 8 0 8 2 0 0 S",
			"1953 1954 3 0 8 2 0 1 D",
			"1953 1959 8 0 8 2 0 0 S",
			"1955 1955 4 1 7 0 0 1 D",
			"1956 1963 3 0 8 2 0 1 D",
			"1960 1960 9 0 8 2 0 0 S",
			"1961 1961 8 0 8 2 0 0 S",
			"1962 1963 9 0 8 2 0 0 S"
		],
		"Pulaski": [
			"1946 1960 3 0 8 2 0 1 D",
			"1946 1954 8 0 8 2 0 0 S",
			"1955 1956 9 0 8 2 0 0 S",
			"1957 1960 8 0 8 2 0 0 S"
		],
		"Louisville": [
			"1921 1921 4 1 7 2 0 1 D",
			"1921 1921 8 1 7 2 0 0 S",
			"1941 1961 3 0 8 2 0 1 D",
			"1941 1941 8 0 8 2 0 0 S",
			"1946 1946 5 2 7 2 0 0 S",
			"1950 1955 8 0 8 2 0 0 S",
			"1956 1960 9 0 8 2 0 0 S"
		],
		"Peru": [
			"1938 1938 0 1 7 0 0 1 S",
			"1938 1938 3 1 7 0 0 0",
			"1938 1939 8 0 8 0 0 1 S",
			"1939 1940 2 24 0 0 0 0",
			"1986 1987 0 1 7 0 0 1 S",
			"1986 1987 3 1 7 0 0 0",
			"1990 1990 0 1 7 0 0 1 S",
			"1990 1990 3 1 7 0 0 0",
			"1994 1994 0 1 7 0 0 1 S",
			"1994 1994 3 1 7 0 0 0"
		],
		"CA": [
			"1948 1948 2 14 7 2 0 1 D",
			"1949 1949 0 1 7 2 0 0 S",
			"1950 1966 3 0 8 2 0 1 D",
			"1950 1961 8 0 8 2 0 0 S",
			"1962 1966 9 0 8 2 0 0 S"
		],
		"Nic": [
			"1979 1980 2 16 0 0 0 1 D",
			"1979 1980 5 23 1 0 0 0 S",
			"2005 2005 3 10 7 0 0 1 D",
			"2005 2005 9 1 0 0 0 0 S",
			"2006 2006 3 30 7 2 0 1 D",
			"2006 2006 9 1 0 1 0 0 S"
		],
		"Menominee": [
			"1946 1946 3 0 8 2 0 1 D",
			"1946 1946 8 0 8 2 0 0 S",
			"1966 1966 3 0 8 2 0 1 D",
			"1966 1966 9 0 8 2 0 0 S"
		],
		"Moncton": [
			"1933 1935 5 8 0 1 0 1 D",
			"1933 1935 8 8 0 1 0 0 S",
			"1936 1938 5 1 0 1 0 1 D",
			"1936 1938 8 1 0 1 0 0 S",
			"1939 1939 4 27 7 1 0 1 D",
			"1939 1941 8 21 6 1 0 0 S",
			"1940 1940 4 19 7 1 0 1 D",
			"1941 1941 4 4 7 1 0 1 D",
			"1946 1972 3 0 8 2 0 1 D",
			"1946 1956 8 0 8 2 0 0 S",
			"1957 1972 9 0 8 2 0 0 S",
			"1993 2006 3 1 0 0:1 0 1 D",
			"1993 2006 9 0 8 0:1 0 0 S"
		],
		"Uruguay": [
			"1923 1923 9 2 7 0 0 0:30 HS",
			"1924 1926 3 1 7 0 0 0",
			"1924 1925 9 1 7 0 0 0:30 HS",
			"1933 1935 9 0 8 0 0 0:30 HS",
			"1934 1936 2 25 6 23:30 2 0",
			"1936 1936 10 1 7 0 0 0:30 HS",
			"1937 1941 2 0 8 0 0 0",
			"1937 1940 9 0 8 0 0 0:30 HS",
			"1941 1941 7 1 7 0 0 0:30 HS",
			"1942 1942 0 1 7 0 0 0",
			"1942 1942 11 14 7 0 0 1 S",
			"1943 1943 2 14 7 0 0 0",
			"1959 1959 4 24 7 0 0 1 S",
			"1959 1959 10 15 7 0 0 0",
			"1960 1960 0 17 7 0 0 1 S",
			"1960 1960 2 6 7 0 0 0",
			"1965 1967 3 1 0 0 0 1 S",
			"1965 1965 8 26 7 0 0 0",
			"1966 1967 9 31 7 0 0 0",
			"1968 1970 4 27 7 0 0 0:30 HS",
			"1968 1970 11 2 7 0 0 0",
			"1972 1972 3 24 7 0 0 1 S",
			"1972 1972 7 15 7 0 0 0",
			"1974 1974 2 10 7 0 0 0:30 HS",
			"1974 1974 11 22 7 0 0 1 S",
			"1976 1976 9 1 7 0 0 0",
			"1977 1977 11 4 7 0 0 1 S",
			"1978 1978 3 1 7 0 0 0",
			"1979 1979 9 1 7 0 0 1 S",
			"1980 1980 4 1 7 0 0 0",
			"1987 1987 11 14 7 0 0 1 S",
			"1988 1988 2 14 7 0 0 0",
			"1988 1988 11 11 7 0 0 1 S",
			"1989 1989 2 12 7 0 0 0",
			"1989 1989 9 29 7 0 0 1 S",
			"1990 1992 2 1 0 0 0 0",
			"1990 1991 9 21 0 0 0 1 S",
			"1992 1992 9 18 7 0 0 1 S",
			"1993 1993 1 28 7 0 0 0",
			"2004 2004 8 19 7 0 0 1 S",
			"2005 2005 2 27 7 2 0 0",
			"2005 2005 9 9 7 2 0 1 S",
			"2006 2006 2 12 7 2 0 0",
			"2006 9999 9 1 0 2 0 1 S",
			"2007 9999 2 8 0 2 0 0"
		],
		"Mont": [
			"1917 1917 2 25 7 2 0 1 D",
			"1917 1917 3 24 7 0 0 0 S",
			"1919 1919 2 31 7 2:30 0 1 D",
			"1919 1919 9 25 7 2:30 0 0 S",
			"1920 1920 4 2 7 2:30 0 1 D",
			"1920 1922 9 1 0 2:30 0 0 S",
			"1921 1921 4 1 7 2 0 1 D",
			"1922 1922 3 30 7 2 0 1 D",
			"1924 1924 4 17 7 2 0 1 D",
			"1924 1926 8 0 8 2:30 0 0 S",
			"1925 1926 4 1 0 2 0 1 D",
			"1927 1927 4 1 7 0 0 1 D",
			"1927 1932 8 0 8 0 0 0 S",
			"1928 1931 3 0 8 0 0 1 D",
			"1932 1932 4 1 7 0 0 1 D",
			"1933 1940 3 0 8 0 0 1 D",
			"1933 1933 9 1 7 0 0 0 S",
			"1934 1939 8 0 8 0 0 0 S",
			"1946 1973 3 0 8 2 0 1 D",
			"1945 1948 8 0 8 2 0 0 S",
			"1949 1950 9 0 8 2 0 0 S",
			"1951 1956 8 0 8 2 0 0 S",
			"1957 1973 9 0 8 2 0 0 S"
		],
		"Bahamas": [
			"1964 1975 9 0 8 2 0 0 S",
			"1964 1975 3 0 8 2 0 1 D"
		],
		"NYC": [
			"1920 1920 2 0 8 2 0 1 D",
			"1920 1920 9 0 8 2 0 0 S",
			"1921 1966 3 0 8 2 0 1 D",
			"1921 1954 8 0 8 2 0 0 S",
			"1955 1966 9 0 8 2 0 0 S"
		],
		"Haiti": [
			"1983 1983 4 8 7 0 0 1 D",
			"1984 1987 3 0 8 0 0 1 D",
			"1983 1987 9 0 8 0 0 0 S",
			"1988 1997 3 1 0 1 2 1 D",
			"1988 1997 9 0 8 1 2 0 S",
			"2005 2006 3 1 0 0 0 1 D",
			"2005 2006 9 0 8 0 0 0 S",
			"2012 9999 2 8 0 2 0 1 D",
			"2012 9999 10 1 0 2 0 0 S"
		],
		"Regina": [
			"1918 1918 3 14 7 2 0 1 D",
			"1918 1918 9 27 7 2 0 0 S",
			"1930 1934 4 1 0 0 0 1 D",
			"1930 1934 9 1 0 0 0 0 S",
			"1937 1941 3 8 0 0 0 1 D",
			"1937 1937 9 8 0 0 0 0 S",
			"1938 1938 9 1 0 0 0 0 S",
			"1939 1941 9 8 0 0 0 0 S",
			"1942 1942 1 9 7 2 0 1 W",
			"1945 1945 7 14 7 23 1 1 P",
			"1945 1945 8 0 8 2 0 0 S",
			"1946 1946 3 8 0 2 0 1 D",
			"1946 1946 9 8 0 2 0 0 S",
			"1947 1957 3 0 8 2 0 1 D",
			"1947 1957 8 0 8 2 0 0 S",
			"1959 1959 3 0 8 2 0 1 D",
			"1959 1959 9 0 8 2 0 0 S"
		],
		"Chile": [
			"1927 1932 8 1 7 0 0 1 S",
			"1928 1932 3 1 7 0 0 0",
			"1942 1942 5 1 7 4 1 0",
			"1942 1942 7 1 7 5 1 1 S",
			"1946 1946 6 15 7 4 1 1 S",
			"1946 1946 8 1 7 3 1 0",
			"1947 1947 3 1 7 4 1 0",
			"1968 1968 10 3 7 4 1 1 S",
			"1969 1969 2 30 7 3 1 0",
			"1969 1969 10 23 7 4 1 1 S",
			"1970 1970 2 29 7 3 1 0",
			"1971 1971 2 14 7 3 1 0",
			"1970 1972 9 9 0 4 1 1 S",
			"1972 1986 2 9 0 3 1 0",
			"1973 1973 8 30 7 4 1 1 S",
			"1974 1987 9 9 0 4 1 1 S",
			"1987 1987 3 12 7 3 1 0",
			"1988 1989 2 9 0 3 1 0",
			"1988 1988 9 1 0 4 1 1 S",
			"1989 1989 9 9 0 4 1 1 S",
			"1990 1990 2 18 7 3 1 0",
			"1990 1990 8 16 7 4 1 1 S",
			"1991 1996 2 9 0 3 1 0",
			"1991 1997 9 9 0 4 1 1 S",
			"1997 1997 2 30 7 3 1 0",
			"1998 1998 2 9 0 3 1 0",
			"1998 1998 8 27 7 4 1 1 S",
			"1999 1999 3 4 7 3 1 0",
			"1999 2010 9 9 0 4 1 1 S",
			"2000 2007 2 9 0 3 1 0",
			"2008 2008 2 30 7 3 1 0",
			"2009 2009 2 9 0 3 1 0",
			"2010 2010 3 1 0 3 1 0",
			"2011 2011 4 2 0 3 1 0",
			"2011 2011 7 16 0 4 1 1 S",
			"2012 9999 3 23 0 3 1 0",
			"2012 9999 8 2 0 4 1 1 S"
		],
		"DR": [
			"1966 1966 9 30 7 0 0 1 D",
			"1967 1967 1 28 7 0 0 0 S",
			"1969 1973 9 0 8 0 0 0:30 HD",
			"1970 1970 1 21 7 0 0 0 S",
			"1971 1971 0 20 7 0 0 0 S",
			"1972 1974 0 21 7 0 0 0 S"
		],
		"C-Eur": [
			"1916 1916 3 30 7 23 0 1 S",
			"1916 1916 9 1 7 1 0 0",
			"1917 1918 3 15 1 2 2 1 S",
			"1917 1918 8 15 1 2 2 0",
			"1940 1940 3 1 7 2 2 1 S",
			"1942 1942 10 2 7 2 2 0",
			"1943 1943 2 29 7 2 2 1 S",
			"1943 1943 9 4 7 2 2 0",
			"1944 1945 3 1 1 2 2 1 S",
			"1944 1944 9 2 7 2 2 0",
			"1945 1945 8 16 7 2 2 0",
			"1977 1980 3 1 0 2 2 1 S",
			"1977 1977 8 0 8 2 2 0",
			"1978 1978 9 1 7 2 2 0",
			"1979 1995 8 0 8 2 2 0",
			"1981 9999 2 0 8 2 2 1 S",
			"1996 9999 9 0 8 2 2 0"
		],
		"Swift": [
			"1957 1957 3 0 8 2 0 1 D",
			"1957 1957 9 0 8 2 0 0 S",
			"1959 1961 3 0 8 2 0 1 D",
			"1959 1959 9 0 8 2 0 0 S",
			"1960 1961 8 0 8 2 0 0 S"
		],
		"Hond": [
			"1987 1988 4 1 0 0 0 1 D",
			"1987 1988 8 0 8 0 0 0 S",
			"2006 2006 4 1 0 0 0 1 D",
			"2006 2006 7 1 1 0 0 0 S"
		],
		"Thule": [
			"1991 1992 2 0 8 2 0 1 D",
			"1991 1992 8 0 8 2 0 0 S",
			"1993 2006 3 1 0 2 0 1 D",
			"1993 2006 9 0 8 2 0 0 S",
			"2007 9999 2 8 0 2 0 1 D",
			"2007 9999 10 1 0 2 0 0 S"
		],
		"Toronto": [
			"1919 1919 2 30 7 23:30 0 1 D",
			"1919 1919 9 26 7 0 0 0 S",
			"1920 1920 4 2 7 2 0 1 D",
			"1920 1920 8 26 7 0 0 0 S",
			"1921 1921 4 15 7 2 0 1 D",
			"1921 1921 8 15 7 2 0 0 S",
			"1922 1923 4 8 0 2 0 1 D",
			"1922 1926 8 15 0 2 0 0 S",
			"1924 1927 4 1 0 2 0 1 D",
			"1927 1932 8 0 8 2 0 0 S",
			"1928 1931 3 0 8 2 0 1 D",
			"1932 1932 4 1 7 2 0 1 D",
			"1933 1940 3 0 8 2 0 1 D",
			"1933 1933 9 1 7 2 0 0 S",
			"1934 1939 8 0 8 2 0 0 S",
			"1945 1946 8 0 8 2 0 0 S",
			"1946 1946 3 0 8 2 0 1 D",
			"1947 1949 3 0 8 0 0 1 D",
			"1947 1948 8 0 8 0 0 0 S",
			"1949 1949 10 0 8 0 0 0 S",
			"1950 1973 3 0 8 2 0 1 D",
			"1950 1950 10 0 8 2 0 0 S",
			"1951 1956 8 0 8 2 0 0 S",
			"1957 1973 9 0 8 2 0 0 S"
		],
		"Winn": [
			"1916 1916 3 23 7 0 0 1 D",
			"1916 1916 8 17 7 0 0 0 S",
			"1918 1918 3 14 7 2 0 1 D",
			"1918 1918 9 27 7 2 0 0 S",
			"1937 1937 4 16 7 2 0 1 D",
			"1937 1937 8 26 7 2 0 0 S",
			"1942 1942 1 9 7 2 0 1 W",
			"1945 1945 7 14 7 23 1 1 P",
			"1945 1945 8 0 8 2 0 0 S",
			"1946 1946 4 12 7 2 0 1 D",
			"1946 1946 9 13 7 2 0 0 S",
			"1947 1949 3 0 8 2 0 1 D",
			"1947 1949 8 0 8 2 0 0 S",
			"1950 1950 4 1 7 2 0 1 D",
			"1950 1950 8 30 7 2 0 0 S",
			"1951 1960 3 0 8 2 0 1 D",
			"1951 1958 8 0 8 2 0 0 S",
			"1959 1959 9 0 8 2 0 0 S",
			"1960 1960 8 0 8 2 0 0 S",
			"1963 1963 3 0 8 2 0 1 D",
			"1963 1963 8 22 7 2 0 0 S",
			"1966 1986 3 0 8 2 2 1 D",
			"1966 2005 9 0 8 2 2 0 S",
			"1987 2005 3 1 0 2 2 1 D"
		],
		"Aus": [
			"1917 1917 0 1 7 0:1 0 1",
			"1917 1917 2 25 7 2 0 0",
			"1942 1942 0 1 7 2 0 1",
			"1942 1942 2 29 7 2 0 0",
			"1942 1942 8 27 7 2 0 1",
			"1943 1944 2 0 8 2 0 0",
			"1943 1943 9 3 7 2 0 1"
		],
		"AT": [
			"1967 1967 9 1 0 2 2 1",
			"1968 1968 2 0 8 2 2 0",
			"1968 1985 9 0 8 2 2 1",
			"1969 1971 2 8 0 2 2 0",
			"1972 1972 1 0 8 2 2 0",
			"1973 1981 2 1 0 2 2 0",
			"1982 1983 2 0 8 2 2 0",
			"1984 1986 2 1 0 2 2 0",
			"1986 1986 9 15 0 2 2 1",
			"1987 1990 2 15 0 2 2 0",
			"1987 1987 9 22 0 2 2 1",
			"1988 1990 9 0 8 2 2 1",
			"1991 1999 9 1 0 2 2 1",
			"1991 2005 2 0 8 2 2 0",
			"2000 2000 7 0 8 2 2 1",
			"2001 9999 9 1 0 2 2 1",
			"2006 2006 3 1 0 2 2 0",
			"2007 2007 2 0 8 2 2 0",
			"2008 9999 3 1 0 2 2 0"
		],
		"NZAQ": [
			"1974 1974 10 3 7 2 2 1 D",
			"1975 1988 9 0 8 2 2 1 D",
			"1989 1989 9 8 7 2 2 1 D",
			"1990 2006 9 1 0 2 2 1 D",
			"1975 1975 1 23 7 2 2 0 S",
			"1976 1989 2 1 0 2 2 0 S",
			"1990 2007 2 15 0 2 2 0 S",
			"2007 9999 8 0 8 2 2 1 D",
			"2008 9999 3 1 0 2 2 0 S"
		],
		"ArgAQ": [
			"1964 1966 2 1 7 0 0 0",
			"1964 1966 9 15 7 0 0 1 S",
			"1967 1967 3 2 7 0 0 0",
			"1967 1968 9 1 0 0 0 1 S",
			"1968 1969 3 1 0 0 0 0",
			"1974 1974 0 23 7 0 0 1 S",
			"1974 1974 4 1 7 0 0 0"
		],
		"ChileAQ": [
			"1972 1986 2 9 0 3 1 0",
			"1974 1987 9 9 0 4 1 1 S",
			"1987 1987 3 12 7 3 1 0",
			"1988 1989 2 9 0 3 1 0",
			"1988 1988 9 1 0 4 1 1 S",
			"1989 1989 9 9 0 4 1 1 S",
			"1990 1990 2 18 7 3 1 0",
			"1990 1990 8 16 7 4 1 1 S",
			"1991 1996 2 9 0 3 1 0",
			"1991 1997 9 9 0 4 1 1 S",
			"1997 1997 2 30 7 3 1 0",
			"1998 1998 2 9 0 3 1 0",
			"1998 1998 8 27 7 4 1 1 S",
			"1999 1999 3 4 7 3 1 0",
			"1999 2010 9 9 0 4 1 1 S",
			"2000 2007 2 9 0 3 1 0",
			"2008 2008 2 30 7 3 1 0",
			"2009 2009 2 9 0 3 1 0",
			"2010 2010 3 1 0 3 1 0",
			"2011 2011 4 2 0 3 1 0",
			"2011 2011 7 16 0 4 1 1 S",
			"2012 9999 3 23 0 3 1 0",
			"2012 9999 8 2 0 4 1 1 S"
		],
		"Norway": [
			"1916 1916 4 22 7 1 0 1 S",
			"1916 1916 8 30 7 0 0 0",
			"1945 1945 3 2 7 2 2 1 S",
			"1945 1945 9 1 7 2 2 0",
			"1959 1964 2 15 0 2 2 1 S",
			"1959 1965 8 15 0 2 2 0",
			"1965 1965 3 25 7 2 2 1 S"
		],
		"RussiaAsia": [
			"1981 1984 3 1 7 0 0 1 S",
			"1981 1983 9 1 7 0 0 0",
			"1984 1991 8 0 8 2 2 0",
			"1985 1991 2 0 8 2 2 1 S",
			"1992 1992 2 6 8 23 0 1 S",
			"1992 1992 8 6 8 23 0 0",
			"1993 9999 2 0 8 2 2 1 S",
			"1993 1995 8 0 8 2 2 0",
			"1996 9999 9 0 8 2 2 0"
		],
		"Jordan": [
			"1973 1973 5 6 7 0 0 1 S",
			"1973 1975 9 1 7 0 0 0",
			"1974 1977 4 1 7 0 0 1 S",
			"1976 1976 10 1 7 0 0 0",
			"1977 1977 9 1 7 0 0 0",
			"1978 1978 3 30 7 0 0 1 S",
			"1978 1978 8 30 7 0 0 0",
			"1985 1985 3 1 7 0 0 1 S",
			"1985 1985 9 1 7 0 0 0",
			"1986 1988 3 1 5 0 0 1 S",
			"1986 1990 9 1 5 0 0 0",
			"1989 1989 4 8 7 0 0 1 S",
			"1990 1990 3 27 7 0 0 1 S",
			"1991 1991 3 17 7 0 0 1 S",
			"1991 1991 8 27 7 0 0 0",
			"1992 1992 3 10 7 0 0 1 S",
			"1992 1993 9 1 5 0 0 0",
			"1993 1998 3 1 5 0 0 1 S",
			"1994 1994 8 15 5 0 0 0",
			"1995 1998 8 15 5 0 2 0",
			"1999 1999 6 1 7 0 2 1 S",
			"1999 2002 8 5 8 0 2 0",
			"2000 2001 2 4 8 0 2 1 S",
			"2002 9999 2 4 8 24 0 1 S",
			"2003 2003 9 24 7 0 2 0",
			"2004 2004 9 15 7 0 2 0",
			"2005 2005 8 5 8 0 2 0",
			"2006 2011 9 5 8 0 2 0",
			"2013 9999 9 5 8 0 2 0"
		],
		"Russia": [
			"1917 1917 6 1 7 23 0 1 MST",
			"1917 1917 11 28 7 0 0 0 MMT",
			"1918 1918 4 31 7 22 0 2 MDST",
			"1918 1918 8 16 7 1 0 1 MST",
			"1919 1919 4 31 7 23 0 2 MDST",
			"1919 1919 6 1 7 2 0 1 S",
			"1919 1919 7 16 7 0 0 0",
			"1921 1921 1 14 7 23 0 1 S",
			"1921 1921 2 20 7 23 0 2 M",
			"1921 1921 8 1 7 0 0 1 S",
			"1921 1921 9 1 7 0 0 0",
			"1981 1984 3 1 7 0 0 1 S",
			"1981 1983 9 1 7 0 0 0",
			"1984 1991 8 0 8 2 2 0",
			"1985 1991 2 0 8 2 2 1 S",
			"1992 1992 2 6 8 23 0 1 S",
			"1992 1992 8 6 8 23 0 0",
			"1993 2010 2 0 8 2 2 1 S",
			"1993 1995 8 0 8 2 2 0",
			"1996 2010 9 0 8 2 2 0"
		],
		"Iraq": [
			"1982 1982 4 1 7 0 0 1 D",
			"1982 1984 9 1 7 0 0 0 S",
			"1983 1983 2 31 7 0 0 1 D",
			"1984 1985 3 1 7 0 0 1 D",
			"1985 1990 8 0 8 1 2 0 S",
			"1986 1990 2 0 8 1 2 1 D",
			"1991 2007 3 1 7 3 2 1 D",
			"1991 2007 9 1 7 3 2 0 S"
		],
		"EUAsia": [
			"1981 9999 2 0 8 1 1 1 S",
			"1979 1995 8 0 8 1 1 0",
			"1996 9999 9 0 8 1 1 0"
		],
		"Azer": [
			"1997 9999 2 0 8 4 0 1 S",
			"1997 9999 9 0 8 5 0 0"
		],
		"Lebanon": [
			"1920 1920 2 28 7 0 0 1 S",
			"1920 1920 9 25 7 0 0 0",
			"1921 1921 3 3 7 0 0 1 S",
			"1921 1921 9 3 7 0 0 0",
			"1922 1922 2 26 7 0 0 1 S",
			"1922 1922 9 8 7 0 0 0",
			"1923 1923 3 22 7 0 0 1 S",
			"1923 1923 8 16 7 0 0 0",
			"1957 1961 4 1 7 0 0 1 S",
			"1957 1961 9 1 7 0 0 0",
			"1972 1972 5 22 7 0 0 1 S",
			"1972 1977 9 1 7 0 0 0",
			"1973 1977 4 1 7 0 0 1 S",
			"1978 1978 3 30 7 0 0 1 S",
			"1978 1978 8 30 7 0 0 0",
			"1984 1987 4 1 7 0 0 1 S",
			"1984 1991 9 16 7 0 0 0",
			"1988 1988 5 1 7 0 0 1 S",
			"1989 1989 4 10 7 0 0 1 S",
			"1990 1992 4 1 7 0 0 1 S",
			"1992 1992 9 4 7 0 0 0",
			"1993 9999 2 0 8 0 0 1 S",
			"1993 1998 8 0 8 0 0 0",
			"1999 9999 9 0 8 0 0 0"
		],
		"Kyrgyz": [
			"1992 1996 3 7 0 0 2 1 S",
			"1992 1996 8 0 8 0 0 0",
			"1997 2005 2 0 8 2:30 0 1 S",
			"1997 2004 9 0 8 2:30 0 0"
		],
		"Mongol": [
			"1983 1984 3 1 7 0 0 1 S",
			"1983 1983 9 1 7 0 0 0",
			"1985 1998 2 0 8 0 0 1 S",
			"1984 1998 8 0 8 0 0 0",
			"2001 2001 3 6 8 2 0 1 S",
			"2001 2006 8 6 8 2 0 0",
			"2002 2006 2 6 8 2 0 1 S"
		],
		"PRC": [
			"1986 1986 4 4 7 0 0 1 D",
			"1986 1991 8 11 0 0 0 0 S",
			"1987 1991 3 10 0 0 0 1 D"
		],
		"Syria": [
			"1920 1923 3 15 0 2 0 1 S",
			"1920 1923 9 1 0 2 0 0",
			"1962 1962 3 29 7 2 0 1 S",
			"1962 1962 9 1 7 2 0 0",
			"1963 1965 4 1 7 2 0 1 S",
			"1963 1963 8 30 7 2 0 0",
			"1964 1964 9 1 7 2 0 0",
			"1965 1965 8 30 7 2 0 0",
			"1966 1966 3 24 7 2 0 1 S",
			"1966 1976 9 1 7 2 0 0",
			"1967 1978 4 1 7 2 0 1 S",
			"1977 1978 8 1 7 2 0 0",
			"1983 1984 3 9 7 2 0 1 S",
			"1983 1984 9 1 7 2 0 0",
			"1986 1986 1 16 7 2 0 1 S",
			"1986 1986 9 9 7 2 0 0",
			"1987 1987 2 1 7 2 0 1 S",
			"1987 1988 9 31 7 2 0 0",
			"1988 1988 2 15 7 2 0 1 S",
			"1989 1989 2 31 7 2 0 1 S",
			"1989 1989 9 1 7 2 0 0",
			"1990 1990 3 1 7 2 0 1 S",
			"1990 1990 8 30 7 2 0 0",
			"1991 1991 3 1 7 0 0 1 S",
			"1991 1992 9 1 7 0 0 0",
			"1992 1992 3 8 7 0 0 1 S",
			"1993 1993 2 26 7 0 0 1 S",
			"1993 1993 8 25 7 0 0 0",
			"1994 1996 3 1 7 0 0 1 S",
			"1994 2005 9 1 7 0 0 0",
			"1997 1998 2 1 8 0 0 1 S",
			"1999 2006 3 1 7 0 0 1 S",
			"2006 2006 8 22 7 0 0 0",
			"2007 2007 2 5 8 0 0 1 S",
			"2007 2007 10 1 5 0 0 0",
			"2008 2008 3 1 5 0 0 1 S",
			"2008 2008 10 1 7 0 0 0",
			"2009 2009 2 5 8 0 0 1 S",
			"2010 2011 3 1 5 0 0 1 S",
			"2012 9999 2 5 8 0 0 1 S",
			"2009 9999 9 5 8 0 0 0"
		],
		"Dhaka": [
			"2009 2009 5 19 7 23 0 1 S",
			"2009 2009 11 31 7 23:59 0 0"
		],
		"Zion": [
			"1940 1940 5 1 7 0 0 1 D",
			"1942 1944 10 1 7 0 0 0 S",
			"1943 1943 3 1 7 2 0 1 D",
			"1944 1944 3 1 7 0 0 1 D",
			"1945 1945 3 16 7 0 0 1 D",
			"1945 1945 10 1 7 2 0 0 S",
			"1946 1946 3 16 7 2 0 1 D",
			"1946 1946 10 1 7 0 0 0 S",
			"1948 1948 4 23 7 0 0 2 DD",
			"1948 1948 8 1 7 0 0 1 D",
			"1948 1949 10 1 7 2 0 0 S",
			"1949 1949 4 1 7 0 0 1 D",
			"1950 1950 3 16 7 0 0 1 D",
			"1950 1950 8 15 7 3 0 0 S",
			"1951 1951 3 1 7 0 0 1 D",
			"1951 1951 10 11 7 3 0 0 S",
			"1952 1952 3 20 7 2 0 1 D",
			"1952 1952 9 19 7 3 0 0 S",
			"1953 1953 3 12 7 2 0 1 D",
			"1953 1953 8 13 7 3 0 0 S",
			"1954 1954 5 13 7 0 0 1 D",
			"1954 1954 8 12 7 0 0 0 S",
			"1955 1955 5 11 7 2 0 1 D",
			"1955 1955 8 11 7 0 0 0 S",
			"1956 1956 5 3 7 0 0 1 D",
			"1956 1956 8 30 7 3 0 0 S",
			"1957 1957 3 29 7 2 0 1 D",
			"1957 1957 8 22 7 0 0 0 S",
			"1974 1974 6 7 7 0 0 1 D",
			"1974 1974 9 13 7 0 0 0 S",
			"1975 1975 3 20 7 0 0 1 D",
			"1975 1975 7 31 7 0 0 0 S",
			"1985 1985 3 14 7 0 0 1 D",
			"1985 1985 8 15 7 0 0 0 S",
			"1986 1986 4 18 7 0 0 1 D",
			"1986 1986 8 7 7 0 0 0 S",
			"1987 1987 3 15 7 0 0 1 D",
			"1987 1987 8 13 7 0 0 0 S",
			"1988 1988 3 9 7 0 0 1 D",
			"1988 1988 8 3 7 0 0 0 S",
			"1989 1989 3 30 7 0 0 1 D",
			"1989 1989 8 3 7 0 0 0 S",
			"1990 1990 2 25 7 0 0 1 D",
			"1990 1990 7 26 7 0 0 0 S",
			"1991 1991 2 24 7 0 0 1 D",
			"1991 1991 8 1 7 0 0 0 S",
			"1992 1992 2 29 7 0 0 1 D",
			"1992 1992 8 6 7 0 0 0 S",
			"1993 1993 3 2 7 0 0 1 D",
			"1993 1993 8 5 7 0 0 0 S",
			"1994 1994 3 1 7 0 0 1 D",
			"1994 1994 7 28 7 0 0 0 S",
			"1995 1995 2 31 7 0 0 1 D",
			"1995 1995 8 3 7 0 0 0 S",
			"1996 1996 2 15 7 0 0 1 D",
			"1996 1996 8 16 7 0 0 0 S",
			"1997 1997 2 21 7 0 0 1 D",
			"1997 1997 8 14 7 0 0 0 S",
			"1998 1998 2 20 7 0 0 1 D",
			"1998 1998 8 6 7 0 0 0 S",
			"1999 1999 3 2 7 2 0 1 D",
			"1999 1999 8 3 7 2 0 0 S",
			"2000 2000 3 14 7 2 0 1 D",
			"2000 2000 9 6 7 1 0 0 S",
			"2001 2001 3 9 7 1 0 1 D",
			"2001 2001 8 24 7 1 0 0 S",
			"2002 2002 2 29 7 1 0 1 D",
			"2002 2002 9 7 7 1 0 0 S",
			"2003 2003 2 28 7 1 0 1 D",
			"2003 2003 9 3 7 1 0 0 S",
			"2004 2004 3 7 7 1 0 1 D",
			"2004 2004 8 22 7 1 0 0 S",
			"2005 2005 3 1 7 2 0 1 D",
			"2005 2005 9 9 7 2 0 0 S",
			"2006 2010 2 26 5 2 0 1 D",
			"2006 2006 9 1 7 2 0 0 S",
			"2007 2007 8 16 7 2 0 0 S",
			"2008 2008 9 5 7 2 0 0 S",
			"2009 2009 8 27 7 2 0 0 S",
			"2010 2010 8 12 7 2 0 0 S",
			"2011 2011 3 1 7 2 0 1 D",
			"2011 2011 9 2 7 2 0 0 S",
			"2012 2012 2 26 5 2 0 1 D",
			"2012 2012 8 23 7 2 0 0 S",
			"2013 9999 2 23 5 2 0 1 D",
			"2013 2026 9 2 0 2 0 0 S",
			"2027 2027 9 3 1 2 0 0 S",
			"2028 9999 9 2 0 2 0 0 S"
		],
		"EgyptAsia": [
			"1957 1957 4 10 7 0 0 1 S",
			"1957 1958 9 1 7 0 0 0",
			"1958 1958 4 1 7 0 0 1 S",
			"1959 1967 4 1 7 1 0 1 S",
			"1959 1965 8 30 7 3 0 0",
			"1966 1966 9 1 7 3 0 0"
		],
		"Palestine": [
			"1999 2005 3 15 5 0 0 1 S",
			"1999 2003 9 15 5 0 0 0",
			"2004 2004 9 1 7 1 0 0",
			"2005 2005 9 4 7 2 0 0",
			"2006 2007 3 1 7 0 0 1 S",
			"2006 2006 8 22 7 0 0 0",
			"2007 2007 8 8 4 2 0 0",
			"2008 2009 2 5 8 0 0 1 S",
			"2008 2008 8 1 7 0 0 0",
			"2009 2009 8 1 5 1 0 0",
			"2010 2010 2 26 7 0 0 1 S",
			"2010 2010 7 11 7 0 0 0",
			"2011 2011 3 1 7 0:1 0 1 S",
			"2011 2011 7 1 7 0 0 0",
			"2011 2011 7 30 7 0 0 1 S",
			"2011 2011 8 30 7 0 0 0",
			"2012 9999 2 4 8 24 0 1 S",
			"2012 9999 8 21 5 1 0 0"
		],
		"HK": [
			"1941 1941 3 1 7 3:30 0 1 S",
			"1941 1941 8 30 7 3:30 0 0",
			"1946 1946 3 20 7 3:30 0 1 S",
			"1946 1946 11 1 7 3:30 0 0",
			"1947 1947 3 13 7 3:30 0 1 S",
			"1947 1947 11 30 7 3:30 0 0",
			"1948 1948 4 2 7 3:30 0 1 S",
			"1948 1951 9 0 8 3:30 0 0",
			"1952 1952 9 25 7 3:30 0 0",
			"1949 1953 3 1 0 3:30 0 1 S",
			"1953 1953 10 1 7 3:30 0 0",
			"1954 1964 2 18 0 3:30 0 1 S",
			"1954 1954 9 31 7 3:30 0 0",
			"1955 1964 10 1 0 3:30 0 0",
			"1965 1976 3 16 0 3:30 0 1 S",
			"1965 1976 9 16 0 3:30 0 0",
			"1973 1973 11 30 7 3:30 0 1 S",
			"1979 1979 4 8 0 3:30 0 1 S",
			"1979 1979 9 16 0 3:30 0 0"
		],
		"Pakistan": [
			"2002 2002 3 2 0 0:1 0 1 S",
			"2002 2002 9 2 0 0:1 0 0",
			"2008 2008 5 1 7 0 0 1 S",
			"2008 2008 10 1 7 0 0 0",
			"2009 2009 3 15 7 0 0 1 S",
			"2009 2009 10 1 7 0 0 0"
		],
		"NBorneo": [
			"1935 1941 8 14 7 0 0 0:20 TS",
			"1935 1941 11 14 7 0 0 0"
		],
		"Macau": [
			"1961 1962 2 16 0 3:30 0 1 S",
			"1961 1964 10 1 0 3:30 0 0",
			"1963 1963 2 16 0 0 0 1 S",
			"1964 1964 2 16 0 3:30 0 1 S",
			"1965 1965 2 16 0 0 0 1 S",
			"1965 1965 9 31 7 0 0 0",
			"1966 1971 3 16 0 3:30 0 1 S",
			"1966 1971 9 16 0 3:30 0 0",
			"1972 1974 3 15 0 0 0 1 S",
			"1972 1973 9 15 0 0 0 0",
			"1974 1977 9 15 0 3:30 0 0",
			"1975 1977 3 15 0 3:30 0 1 S",
			"1978 1980 3 15 0 0 0 1 S",
			"1978 1980 9 15 0 0 0 0"
		],
		"Phil": [
			"1936 1936 10 1 7 0 0 1 S",
			"1937 1937 1 1 7 0 0 0",
			"1954 1954 3 12 7 0 0 1 S",
			"1954 1954 6 1 7 0 0 0",
			"1978 1978 2 22 7 0 0 1 S",
			"1978 1978 8 21 7 0 0 0"
		],
		"Cyprus": [
			"1975 1975 3 13 7 0 0 1 S",
			"1975 1975 9 12 7 0 0 0",
			"1976 1976 4 15 7 0 0 1 S",
			"1976 1976 9 11 7 0 0 0",
			"1977 1980 3 1 0 0 0 1 S",
			"1977 1977 8 25 7 0 0 0",
			"1978 1978 9 2 7 0 0 0",
			"1979 1997 8 0 8 0 0 0",
			"1981 1998 2 0 8 0 0 1 S"
		],
		"ROK": [
			"1960 1960 4 15 7 0 0 1 D",
			"1960 1960 8 13 7 0 0 0 S",
			"1987 1988 4 8 0 0 0 1 D",
			"1987 1988 9 8 0 0 0 0 S"
		],
		"Shang": [
			"1940 1940 5 3 7 0 0 1 D",
			"1940 1941 9 1 7 0 0 0 S",
			"1941 1941 2 16 7 0 0 1 D"
		],
		"Taiwan": [
			"1945 1951 4 1 7 0 0 1 D",
			"1945 1951 9 1 7 0 0 0 S",
			"1952 1952 2 1 7 0 0 1 D",
			"1952 1954 10 1 7 0 0 0 S",
			"1953 1959 3 1 7 0 0 1 D",
			"1955 1961 9 1 7 0 0 0 S",
			"1960 1961 5 1 7 0 0 1 D",
			"1974 1975 3 1 7 0 0 1 D",
			"1974 1975 9 1 7 0 0 0 S",
			"1979 1979 5 30 7 0 0 1 D",
			"1979 1979 8 30 7 0 0 0 S"
		],
		"E-EurAsia": [
			"1981 9999 2 0 8 0 0 1 S",
			"1979 1995 8 0 8 0 0 0",
			"1996 9999 9 0 8 0 0 0"
		],
		"Iran": [
			"1978 1980 2 21 7 0 0 1 D",
			"1978 1978 9 21 7 0 0 0 S",
			"1979 1979 8 19 7 0 0 0 S",
			"1980 1980 8 23 7 0 0 0 S",
			"1991 1991 4 3 7 0 0 1 D",
			"1992 1995 2 22 7 0 0 1 D",
			"1991 1995 8 22 7 0 0 0 S",
			"1996 1996 2 21 7 0 0 1 D",
			"1996 1996 8 21 7 0 0 0 S",
			"1997 1999 2 22 7 0 0 1 D",
			"1997 1999 8 22 7 0 0 0 S",
			"2000 2000 2 21 7 0 0 1 D",
			"2000 2000 8 21 7 0 0 0 S",
			"2001 2003 2 22 7 0 0 1 D",
			"2001 2003 8 22 7 0 0 0 S",
			"2004 2004 2 21 7 0 0 1 D",
			"2004 2004 8 21 7 0 0 0 S",
			"2005 2005 2 22 7 0 0 1 D",
			"2005 2005 8 22 7 0 0 0 S",
			"2008 2008 2 21 7 0 0 1 D",
			"2008 2008 8 21 7 0 0 0 S",
			"2009 2011 2 22 7 0 0 1 D",
			"2009 2011 8 22 7 0 0 0 S",
			"2012 2012 2 21 7 0 0 1 D",
			"2012 2012 8 21 7 0 0 0 S",
			"2013 2015 2 22 7 0 0 1 D",
			"2013 2015 8 22 7 0 0 0 S",
			"2016 2016 2 21 7 0 0 1 D",
			"2016 2016 8 21 7 0 0 0 S",
			"2017 2019 2 22 7 0 0 1 D",
			"2017 2019 8 22 7 0 0 0 S",
			"2020 2020 2 21 7 0 0 1 D",
			"2020 2020 8 21 7 0 0 0 S",
			"2021 2023 2 22 7 0 0 1 D",
			"2021 2023 8 22 7 0 0 0 S",
			"2024 2024 2 21 7 0 0 1 D",
			"2024 2024 8 21 7 0 0 0 S",
			"2025 2027 2 22 7 0 0 1 D",
			"2025 2027 8 22 7 0 0 0 S",
			"2028 2029 2 21 7 0 0 1 D",
			"2028 2029 8 21 7 0 0 0 S",
			"2030 2031 2 22 7 0 0 1 D",
			"2030 2031 8 22 7 0 0 0 S",
			"2032 2033 2 21 7 0 0 1 D",
			"2032 2033 8 21 7 0 0 0 S",
			"2034 2035 2 22 7 0 0 1 D",
			"2034 2035 8 22 7 0 0 0 S",
			"2036 2037 2 21 7 0 0 1 D",
			"2036 2037 8 21 7 0 0 0 S"
		],
		"Japan": [
			"1948 1948 4 1 0 2 0 1 D",
			"1948 1951 8 8 6 2 0 0 S",
			"1949 1949 3 1 0 2 0 1 D",
			"1950 1951 4 1 0 2 0 1 D"
		],
		"Port": [
			"1916 1916 5 17 7 23 0 1 S",
			"1916 1916 10 1 7 1 0 0",
			"1917 1917 1 28 7 23 2 1 S",
			"1917 1921 9 14 7 23 2 0",
			"1918 1918 2 1 7 23 2 1 S",
			"1919 1919 1 28 7 23 2 1 S",
			"1920 1920 1 29 7 23 2 1 S",
			"1921 1921 1 28 7 23 2 1 S",
			"1924 1924 3 16 7 23 2 1 S",
			"1924 1924 9 14 7 23 2 0",
			"1926 1926 3 17 7 23 2 1 S",
			"1926 1929 9 1 6 23 2 0",
			"1927 1927 3 9 7 23 2 1 S",
			"1928 1928 3 14 7 23 2 1 S",
			"1929 1929 3 20 7 23 2 1 S",
			"1931 1931 3 18 7 23 2 1 S",
			"1931 1932 9 1 6 23 2 0",
			"1932 1932 3 2 7 23 2 1 S",
			"1934 1934 3 7 7 23 2 1 S",
			"1934 1938 9 1 6 23 2 0",
			"1935 1935 2 30 7 23 2 1 S",
			"1936 1936 3 18 7 23 2 1 S",
			"1937 1937 3 3 7 23 2 1 S",
			"1938 1938 2 26 7 23 2 1 S",
			"1939 1939 3 15 7 23 2 1 S",
			"1939 1939 10 18 7 23 2 0",
			"1940 1940 1 24 7 23 2 1 S",
			"1940 1941 9 5 7 23 2 0",
			"1941 1941 3 5 7 23 2 1 S",
			"1942 1945 2 8 6 23 2 1 S",
			"1942 1942 3 25 7 22 2 2 M",
			"1942 1942 7 15 7 22 2 1 S",
			"1942 1945 9 24 6 23 2 0",
			"1943 1943 3 17 7 22 2 2 M",
			"1943 1945 7 25 6 22 2 1 S",
			"1944 1945 3 21 6 22 2 2 M",
			"1946 1946 3 1 6 23 2 1 S",
			"1946 1946 9 1 6 23 2 0",
			"1947 1949 3 1 0 2 2 1 S",
			"1947 1949 9 1 0 2 2 0",
			"1951 1965 3 1 0 2 2 1 S",
			"1951 1965 9 1 0 2 2 0",
			"1977 1977 2 27 7 0 2 1 S",
			"1977 1977 8 25 7 0 2 0",
			"1978 1979 3 1 0 0 2 1 S",
			"1978 1978 9 1 7 0 2 0",
			"1979 1982 8 0 8 1 2 0",
			"1980 1980 2 0 8 0 2 1 S",
			"1981 1982 2 0 8 1 2 1 S",
			"1983 1983 2 0 8 2 2 1 S"
		],
		"W-Eur": [
			"1977 1980 3 1 0 1 2 1 S",
			"1977 1977 8 0 8 1 2 0",
			"1978 1978 9 1 7 1 2 0",
			"1979 1995 8 0 8 1 2 0",
			"1981 9999 2 0 8 1 2 1 S",
			"1996 9999 9 0 8 1 2 0"
		],
		"Iceland": [
			"1917 1918 1 19 7 23 0 1 S",
			"1917 1917 9 21 7 1 0 0",
			"1918 1918 10 16 7 1 0 0",
			"1939 1939 3 29 7 23 0 1 S",
			"1939 1939 10 29 7 2 0 0",
			"1940 1940 1 25 7 2 0 1 S",
			"1940 1940 10 3 7 2 0 0",
			"1941 1941 2 2 7 1 2 1 S",
			"1941 1941 10 2 7 1 2 0",
			"1942 1942 2 8 7 1 2 1 S",
			"1942 1942 9 25 7 1 2 0",
			"1943 1946 2 1 0 1 2 1 S",
			"1943 1948 9 22 0 1 2 0",
			"1947 1967 3 1 0 1 2 1 S",
			"1949 1949 9 30 7 1 2 0",
			"1950 1966 9 22 0 1 2 0",
			"1967 1967 9 29 7 1 2 0"
		],
		"Falk": [
			"1937 1938 8 0 8 0 0 1 S",
			"1938 1942 2 19 0 0 0 0",
			"1939 1939 9 1 7 0 0 1 S",
			"1940 1942 8 0 8 0 0 1 S",
			"1943 1943 0 1 7 0 0 0",
			"1983 1983 8 0 8 0 0 1 S",
			"1984 1985 3 0 8 0 0 0",
			"1984 1984 8 16 7 0 0 1 S",
			"1985 2000 8 9 0 0 0 1 S",
			"1986 2000 3 16 0 0 0 0",
			"2001 2010 3 15 0 2 0 0",
			"2001 2010 8 1 0 2 0 1 S"
		],
		"AS": [
			"1971 1985 9 0 8 2 2 1",
			"1986 1986 9 19 7 2 2 1",
			"1987 2007 9 0 8 2 2 1",
			"1972 1972 1 27 7 2 2 0",
			"1973 1985 2 1 0 2 2 0",
			"1986 1990 2 15 0 2 2 0",
			"1991 1991 2 3 7 2 2 0",
			"1992 1992 2 22 7 2 2 0",
			"1993 1993 2 7 7 2 2 0",
			"1994 1994 2 20 7 2 2 0",
			"1995 2005 2 0 8 2 2 0",
			"2006 2006 3 2 7 2 2 0",
			"2007 2007 2 0 8 2 2 0",
			"2008 9999 3 1 0 2 2 0",
			"2008 9999 9 1 0 2 2 1"
		],
		"AQ": [
			"1971 1971 9 0 8 2 2 1",
			"1972 1972 1 0 8 2 2 0",
			"1989 1991 9 0 8 2 2 1",
			"1990 1992 2 1 0 2 2 0"
		],
		"AN": [
			"1971 1985 9 0 8 2 2 1",
			"1972 1972 1 27 7 2 2 0",
			"1973 1981 2 1 0 2 2 0",
			"1982 1982 3 1 0 2 2 0",
			"1983 1985 2 1 0 2 2 0",
			"1986 1989 2 15 0 2 2 0",
			"1986 1986 9 19 7 2 2 1",
			"1987 1999 9 0 8 2 2 1",
			"1990 1995 2 1 0 2 2 0",
			"1996 2005 2 0 8 2 2 0",
			"2000 2000 7 0 8 2 2 1",
			"2001 2007 9 0 8 2 2 1",
			"2006 2006 3 1 0 2 2 0",
			"2007 2007 2 0 8 2 2 0",
			"2008 9999 3 1 0 2 2 0",
			"2008 9999 9 1 0 2 2 1"
		],
		"AW": [
			"1974 1974 9 0 8 2 2 1",
			"1975 1975 2 1 0 2 2 0",
			"1983 1983 9 0 8 2 2 1",
			"1984 1984 2 1 0 2 2 0",
			"1991 1991 10 17 7 2 2 1",
			"1992 1992 2 1 0 2 2 0",
			"2006 2006 11 3 7 2 2 1",
			"2007 2009 2 0 8 2 2 0",
			"2007 2008 9 0 8 2 2 1"
		],
		"Holiday": [
			"1992 1993 9 0 8 2 2 1",
			"1993 1994 2 1 0 2 2 0"
		],
		"LH": [
			"1981 1984 9 0 8 2 0 1",
			"1982 1985 2 1 0 2 0 0",
			"1985 1985 9 0 8 2 0 0:30",
			"1986 1989 2 15 0 2 0 0",
			"1986 1986 9 19 7 2 0 0:30",
			"1987 1999 9 0 8 2 0 0:30",
			"1990 1995 2 1 0 2 0 0",
			"1996 2005 2 0 8 2 0 0",
			"2000 2000 7 0 8 2 0 0:30",
			"2001 2007 9 0 8 2 0 0:30",
			"2006 2006 3 1 0 2 0 0",
			"2007 2007 2 0 8 2 0 0",
			"2008 9999 3 1 0 2 0 0",
			"2008 9999 9 1 0 2 0 0:30"
		],
		"AV": [
			"1971 1985 9 0 8 2 2 1",
			"1972 1972 1 0 8 2 2 0",
			"1973 1985 2 1 0 2 2 0",
			"1986 1990 2 15 0 2 2 0",
			"1986 1987 9 15 0 2 2 1",
			"1988 1999 9 0 8 2 2 1",
			"1991 1994 2 1 0 2 2 0",
			"1995 2005 2 0 8 2 2 0",
			"2000 2000 7 0 8 2 2 1",
			"2001 2007 9 0 8 2 2 1",
			"2006 2006 3 1 0 2 2 0",
			"2007 2007 2 0 8 2 2 0",
			"2008 9999 3 1 0 2 2 0",
			"2008 9999 9 1 0 2 2 1"
		],
		"Neth": [
			"1916 1916 4 1 7 0 0 1 NST",
			"1916 1916 9 1 7 0 0 0 AMT",
			"1917 1917 3 16 7 2 2 1 NST",
			"1917 1917 8 17 7 2 2 0 AMT",
			"1918 1921 3 1 1 2 2 1 NST",
			"1918 1921 8 1 8 2 2 0 AMT",
			"1922 1922 2 0 8 2 2 1 NST",
			"1922 1936 9 2 0 2 2 0 AMT",
			"1923 1923 5 1 5 2 2 1 NST",
			"1924 1924 2 0 8 2 2 1 NST",
			"1925 1925 5 1 5 2 2 1 NST",
			"1926 1931 4 15 7 2 2 1 NST",
			"1932 1932 4 22 7 2 2 1 NST",
			"1933 1936 4 15 7 2 2 1 NST",
			"1937 1937 4 22 7 2 2 1 NST",
			"1937 1937 6 1 7 0 0 1 S",
			"1937 1939 9 2 0 2 2 0",
			"1938 1939 4 15 7 2 2 1 S",
			"1945 1945 3 2 7 2 2 1 S",
			"1945 1945 8 16 7 2 2 0"
		],
		"Greece": [
			"1932 1932 6 7 7 0 0 1 S",
			"1932 1932 8 1 7 0 0 0",
			"1941 1941 3 7 7 0 0 1 S",
			"1942 1942 10 2 7 3 0 0",
			"1943 1943 2 30 7 0 0 1 S",
			"1943 1943 9 4 7 0 0 0",
			"1952 1952 6 1 7 0 0 1 S",
			"1952 1952 10 2 7 0 0 0",
			"1975 1975 3 12 7 0 2 1 S",
			"1975 1975 10 26 7 0 2 0",
			"1976 1976 3 11 7 2 2 1 S",
			"1976 1976 9 10 7 2 2 0",
			"1977 1978 3 1 0 2 2 1 S",
			"1977 1977 8 26 7 2 2 0",
			"1978 1978 8 24 7 4 0 0",
			"1979 1979 3 1 7 9 0 1 S",
			"1979 1979 8 29 7 2 0 0",
			"1980 1980 3 1 7 0 0 1 S",
			"1980 1980 8 28 7 0 0 0"
		],
		"SovietZone": [
			"1945 1945 4 24 7 2 0 2 M",
			"1945 1945 8 24 7 3 0 1 S",
			"1945 1945 10 18 7 2 2 0"
		],
		"Germany": [
			"1946 1946 3 14 7 2 2 1 S",
			"1946 1946 9 7 7 2 2 0",
			"1947 1949 9 1 0 2 2 0",
			"1947 1947 3 6 7 3 2 1 S",
			"1947 1947 4 11 7 2 2 2 M",
			"1947 1947 5 29 7 3 0 1 S",
			"1948 1948 3 18 7 2 2 1 S",
			"1949 1949 3 10 7 2 2 1 S"
		],
		"Czech": [
			"1945 1945 3 8 7 2 2 1 S",
			"1945 1945 10 18 7 2 2 0",
			"1946 1946 4 6 7 2 2 1 S",
			"1946 1949 9 1 0 2 2 0",
			"1947 1947 3 20 7 2 2 1 S",
			"1948 1948 3 18 7 2 2 1 S",
			"1949 1949 3 9 7 2 2 1 S"
		],
		"Belgium": [
			"1918 1918 2 9 7 0 2 1 S",
			"1918 1919 9 1 6 23 2 0",
			"1919 1919 2 1 7 23 2 1 S",
			"1920 1920 1 14 7 23 2 1 S",
			"1920 1920 9 23 7 23 2 0",
			"1921 1921 2 14 7 23 2 1 S",
			"1921 1921 9 25 7 23 2 0",
			"1922 1922 2 25 7 23 2 1 S",
			"1922 1927 9 1 6 23 2 0",
			"1923 1923 3 21 7 23 2 1 S",
			"1924 1924 2 29 7 23 2 1 S",
			"1925 1925 3 4 7 23 2 1 S",
			"1926 1926 3 17 7 23 2 1 S",
			"1927 1927 3 9 7 23 2 1 S",
			"1928 1928 3 14 7 23 2 1 S",
			"1928 1938 9 2 0 2 2 0",
			"1929 1929 3 21 7 2 2 1 S",
			"1930 1930 3 13 7 2 2 1 S",
			"1931 1931 3 19 7 2 2 1 S",
			"1932 1932 3 3 7 2 2 1 S",
			"1933 1933 2 26 7 2 2 1 S",
			"1934 1934 3 8 7 2 2 1 S",
			"1935 1935 2 31 7 2 2 1 S",
			"1936 1936 3 19 7 2 2 1 S",
			"1937 1937 3 4 7 2 2 1 S",
			"1938 1938 2 27 7 2 2 1 S",
			"1939 1939 3 16 7 2 2 1 S",
			"1939 1939 10 19 7 2 2 0",
			"1940 1940 1 25 7 2 2 1 S",
			"1944 1944 8 17 7 2 2 0",
			"1945 1945 3 2 7 2 2 1 S",
			"1945 1945 8 16 7 2 2 0",
			"1946 1946 4 19 7 2 2 1 S",
			"1946 1946 9 7 7 2 2 0"
		],
		"Romania": [
			"1932 1932 4 21 7 0 2 1 S",
			"1932 1939 9 1 0 0 2 0",
			"1933 1939 3 2 0 0 2 1 S",
			"1979 1979 4 27 7 0 0 1 S",
			"1979 1979 8 0 8 0 0 0",
			"1980 1980 3 5 7 23 0 1 S",
			"1980 1980 8 0 8 1 0 0",
			"1991 1993 2 0 8 0 2 1 S",
			"1991 1993 8 0 8 0 2 0"
		],
		"E-Eur": [
			"1977 1980 3 1 0 0 0 1 S",
			"1977 1977 8 0 8 0 0 0",
			"1978 1978 9 1 7 0 0 0",
			"1979 1995 8 0 8 0 0 0",
			"1981 9999 2 0 8 0 0 1 S",
			"1996 9999 9 0 8 0 0 0"
		],
		"Hungary": [
			"1918 1918 3 1 7 3 0 1 S",
			"1918 1918 8 29 7 3 0 0",
			"1919 1919 3 15 7 3 0 1 S",
			"1919 1919 8 15 7 3 0 0",
			"1920 1920 3 5 7 3 0 1 S",
			"1920 1920 8 30 7 3 0 0",
			"1945 1945 4 1 7 23 0 1 S",
			"1945 1945 10 3 7 0 0 0",
			"1946 1946 2 31 7 2 2 1 S",
			"1946 1949 9 1 0 2 2 0",
			"1947 1949 3 4 0 2 2 1 S",
			"1950 1950 3 17 7 2 2 1 S",
			"1950 1950 9 23 7 2 2 0",
			"1954 1955 4 23 7 0 0 1 S",
			"1954 1955 9 3 7 0 0 0",
			"1956 1956 5 1 0 0 0 1 S",
			"1956 1956 8 0 8 0 0 0",
			"1957 1957 5 1 0 1 0 1 S",
			"1957 1957 8 0 8 3 0 0",
			"1980 1980 3 6 7 1 0 1 S"
		],
		"Swiss": [
			"1941 1942 4 1 1 1 0 1 S",
			"1941 1942 9 1 1 2 0 0"
		],
		"Denmark": [
			"1916 1916 4 14 7 23 0 1 S",
			"1916 1916 8 30 7 23 0 0",
			"1940 1940 4 15 7 0 0 1 S",
			"1945 1945 3 2 7 2 2 1 S",
			"1945 1945 7 15 7 2 2 0",
			"1946 1946 4 1 7 2 2 1 S",
			"1946 1946 8 1 7 2 2 0",
			"1947 1947 4 4 7 2 2 1 S",
			"1947 1947 7 10 7 2 2 0",
			"1948 1948 4 9 7 2 2 1 S",
			"1948 1948 7 8 7 2 2 0"
		],
		"GB-Eire": [
			"1916 1916 4 21 7 2 2 1 BST",
			"1916 1916 9 1 7 2 2 0 GMT",
			"1917 1917 3 8 7 2 2 1 BST",
			"1917 1917 8 17 7 2 2 0 GMT",
			"1918 1918 2 24 7 2 2 1 BST",
			"1918 1918 8 30 7 2 2 0 GMT",
			"1919 1919 2 30 7 2 2 1 BST",
			"1919 1919 8 29 7 2 2 0 GMT",
			"1920 1920 2 28 7 2 2 1 BST",
			"1920 1920 9 25 7 2 2 0 GMT",
			"1921 1921 3 3 7 2 2 1 BST",
			"1921 1921 9 3 7 2 2 0 GMT",
			"1922 1922 2 26 7 2 2 1 BST",
			"1922 1922 9 8 7 2 2 0 GMT",
			"1923 1923 3 16 0 2 2 1 BST",
			"1923 1924 8 16 0 2 2 0 GMT",
			"1924 1924 3 9 0 2 2 1 BST",
			"1925 1926 3 16 0 2 2 1 BST",
			"1925 1938 9 2 0 2 2 0 GMT",
			"1927 1927 3 9 0 2 2 1 BST",
			"1928 1929 3 16 0 2 2 1 BST",
			"1930 1930 3 9 0 2 2 1 BST",
			"1931 1932 3 16 0 2 2 1 BST",
			"1933 1933 3 9 0 2 2 1 BST",
			"1934 1934 3 16 0 2 2 1 BST",
			"1935 1935 3 9 0 2 2 1 BST",
			"1936 1937 3 16 0 2 2 1 BST",
			"1938 1938 3 9 0 2 2 1 BST",
			"1939 1939 3 16 0 2 2 1 BST",
			"1939 1939 10 16 0 2 2 0 GMT",
			"1940 1940 1 23 0 2 2 1 BST",
			"1941 1941 4 2 0 1 2 2 BDST",
			"1941 1943 7 9 0 1 2 1 BST",
			"1942 1944 3 2 0 1 2 2 BDST",
			"1944 1944 8 16 0 1 2 1 BST",
			"1945 1945 3 2 1 1 2 2 BDST",
			"1945 1945 6 9 0 1 2 1 BST",
			"1945 1946 9 2 0 2 2 0 GMT",
			"1946 1946 3 9 0 2 2 1 BST",
			"1947 1947 2 16 7 2 2 1 BST",
			"1947 1947 3 13 7 1 2 2 BDST",
			"1947 1947 7 10 7 1 2 1 BST",
			"1947 1947 10 2 7 2 2 0 GMT",
			"1948 1948 2 14 7 2 2 1 BST",
			"1948 1948 9 31 7 2 2 0 GMT",
			"1949 1949 3 3 7 2 2 1 BST",
			"1949 1949 9 30 7 2 2 0 GMT",
			"1950 1952 3 14 0 2 2 1 BST",
			"1950 1952 9 21 0 2 2 0 GMT",
			"1953 1953 3 16 0 2 2 1 BST",
			"1953 1960 9 2 0 2 2 0 GMT",
			"1954 1954 3 9 0 2 2 1 BST",
			"1955 1956 3 16 0 2 2 1 BST",
			"1957 1957 3 9 0 2 2 1 BST",
			"1958 1959 3 16 0 2 2 1 BST",
			"1960 1960 3 9 0 2 2 1 BST",
			"1961 1963 2 0 8 2 2 1 BST",
			"1961 1968 9 23 0 2 2 0 GMT",
			"1964 1967 2 19 0 2 2 1 BST",
			"1968 1968 1 18 7 2 2 1 BST",
			"1972 1980 2 16 0 2 2 1 BST",
			"1972 1980 9 23 0 2 2 0 GMT",
			"1981 1995 2 0 8 1 1 1 BST",
			"1981 1989 9 23 0 1 1 0 GMT",
			"1990 1995 9 22 0 1 1 0 GMT"
		],
		"Finland": [
			"1942 1942 3 3 7 0 0 1 S",
			"1942 1942 9 3 7 0 0 0",
			"1981 1982 2 0 8 2 0 1 S",
			"1981 1982 8 0 8 3 0 0"
		],
		"Turkey": [
			"1916 1916 4 1 7 0 0 1 S",
			"1916 1916 9 1 7 0 0 0",
			"1920 1920 2 28 7 0 0 1 S",
			"1920 1920 9 25 7 0 0 0",
			"1921 1921 3 3 7 0 0 1 S",
			"1921 1921 9 3 7 0 0 0",
			"1922 1922 2 26 7 0 0 1 S",
			"1922 1922 9 8 7 0 0 0",
			"1924 1924 4 13 7 0 0 1 S",
			"1924 1925 9 1 7 0 0 0",
			"1925 1925 4 1 7 0 0 1 S",
			"1940 1940 5 30 7 0 0 1 S",
			"1940 1940 9 5 7 0 0 0",
			"1940 1940 11 1 7 0 0 1 S",
			"1941 1941 8 21 7 0 0 0",
			"1942 1942 3 1 7 0 0 1 S",
			"1942 1942 10 1 7 0 0 0",
			"1945 1945 3 2 7 0 0 1 S",
			"1945 1945 9 8 7 0 0 0",
			"1946 1946 5 1 7 0 0 1 S",
			"1946 1946 9 1 7 0 0 0",
			"1947 1948 3 16 0 0 0 1 S",
			"1947 1950 9 2 0 0 0 0",
			"1949 1949 3 10 7 0 0 1 S",
			"1950 1950 3 19 7 0 0 1 S",
			"1951 1951 3 22 7 0 0 1 S",
			"1951 1951 9 8 7 0 0 0",
			"1962 1962 6 15 7 0 0 1 S",
			"1962 1962 9 8 7 0 0 0",
			"1964 1964 4 15 7 0 0 1 S",
			"1964 1964 9 1 7 0 0 0",
			"1970 1972 4 2 0 0 0 1 S",
			"1970 1972 9 2 0 0 0 0",
			"1973 1973 5 3 7 1 0 1 S",
			"1973 1973 10 4 7 3 0 0",
			"1974 1974 2 31 7 2 0 1 S",
			"1974 1974 10 3 7 5 0 0",
			"1975 1975 2 30 7 0 0 1 S",
			"1975 1976 9 0 8 0 0 0",
			"1976 1976 5 1 7 0 0 1 S",
			"1977 1978 3 1 0 0 0 1 S",
			"1977 1977 9 16 7 0 0 0",
			"1979 1980 3 1 0 3 0 1 S",
			"1979 1982 9 11 1 0 0 0",
			"1981 1982 2 0 8 3 0 1 S",
			"1983 1983 6 31 7 0 0 1 S",
			"1983 1983 9 2 7 0 0 0",
			"1985 1985 3 20 7 0 0 1 S",
			"1985 1985 8 28 7 0 0 0",
			"1986 1990 2 0 8 2 2 1 S",
			"1986 1990 8 0 8 2 2 0",
			"1991 2006 2 0 8 1 2 1 S",
			"1991 1995 8 0 8 1 2 0",
			"1996 2006 9 0 8 1 2 0"
		],
		"Poland": [
			"1918 1919 8 16 7 2 2 0",
			"1919 1919 3 15 7 2 2 1 S",
			"1944 1944 3 3 7 2 2 1 S",
			"1944 1944 9 4 7 2 0 0",
			"1945 1945 3 29 7 0 0 1 S",
			"1945 1945 10 1 7 0 0 0",
			"1946 1946 3 14 7 0 2 1 S",
			"1946 1946 9 7 7 2 2 0",
			"1947 1947 4 4 7 2 2 1 S",
			"1947 1949 9 1 0 2 2 0",
			"1948 1948 3 18 7 2 2 1 S",
			"1949 1949 3 10 7 2 2 1 S",
			"1957 1957 5 2 7 1 2 1 S",
			"1957 1958 8 0 8 1 2 0",
			"1958 1958 2 30 7 1 2 1 S",
			"1959 1959 4 31 7 1 2 1 S",
			"1959 1961 9 1 0 1 2 0",
			"1960 1960 3 3 7 1 2 1 S",
			"1961 1964 4 0 8 1 2 1 S",
			"1962 1964 8 0 8 1 2 0"
		],
		"Lux": [
			"1916 1916 4 14 7 23 0 1 S",
			"1916 1916 9 1 7 1 0 0",
			"1917 1917 3 28 7 23 0 1 S",
			"1917 1917 8 17 7 1 0 0",
			"1918 1918 3 15 1 2 2 1 S",
			"1918 1918 8 15 1 2 2 0",
			"1919 1919 2 1 7 23 0 1 S",
			"1919 1919 9 5 7 3 0 0",
			"1920 1920 1 14 7 23 0 1 S",
			"1920 1920 9 24 7 2 0 0",
			"1921 1921 2 14 7 23 0 1 S",
			"1921 1921 9 26 7 2 0 0",
			"1922 1922 2 25 7 23 0 1 S",
			"1922 1922 9 2 0 1 0 0",
			"1923 1923 3 21 7 23 0 1 S",
			"1923 1923 9 2 0 2 0 0",
			"1924 1924 2 29 7 23 0 1 S",
			"1924 1928 9 2 0 1 0 0",
			"1925 1925 3 5 7 23 0 1 S",
			"1926 1926 3 17 7 23 0 1 S",
			"1927 1927 3 9 7 23 0 1 S",
			"1928 1928 3 14 7 23 0 1 S",
			"1929 1929 3 20 7 23 0 1 S"
		],
		"Italy": [
			"1916 1916 5 3 7 0 2 1 S",
			"1916 1916 9 1 7 0 2 0",
			"1917 1917 3 1 7 0 2 1 S",
			"1917 1917 8 30 7 0 2 0",
			"1918 1918 2 10 7 0 2 1 S",
			"1918 1919 9 1 0 0 2 0",
			"1919 1919 2 2 7 0 2 1 S",
			"1920 1920 2 21 7 0 2 1 S",
			"1920 1920 8 19 7 0 2 0",
			"1940 1940 5 15 7 0 2 1 S",
			"1944 1944 8 17 7 0 2 0",
			"1945 1945 3 2 7 2 0 1 S",
			"1945 1945 8 15 7 0 2 0",
			"1946 1946 2 17 7 2 2 1 S",
			"1946 1946 9 6 7 2 2 0",
			"1947 1947 2 16 7 0 2 1 S",
			"1947 1947 9 5 7 0 2 0",
			"1948 1948 1 29 7 2 2 1 S",
			"1948 1948 9 3 7 2 2 0",
			"1966 1968 4 22 0 0 0 1 S",
			"1966 1969 8 22 0 0 0 0",
			"1969 1969 5 1 7 0 0 1 S",
			"1970 1970 4 31 7 0 0 1 S",
			"1970 1970 8 0 8 0 0 0",
			"1971 1972 4 22 0 0 0 1 S",
			"1971 1971 8 0 8 1 0 0",
			"1972 1972 9 1 7 0 0 0",
			"1973 1973 5 3 7 0 0 1 S",
			"1973 1974 8 0 8 0 0 0",
			"1974 1974 4 26 7 0 0 1 S",
			"1975 1975 5 1 7 0 2 1 S",
			"1975 1977 8 0 8 0 2 0",
			"1976 1976 4 30 7 0 2 1 S",
			"1977 1979 4 22 0 0 2 1 S",
			"1978 1978 9 1 7 0 2 0",
			"1979 1979 8 30 7 0 2 0"
		],
		"Malta": [
			"1973 1973 2 31 7 0 2 1 S",
			"1973 1973 8 29 7 0 2 0",
			"1974 1974 3 21 7 0 2 1 S",
			"1974 1974 8 16 7 0 2 0",
			"1975 1979 3 15 0 2 0 1 S",
			"1975 1980 8 15 0 2 0 0",
			"1980 1980 2 31 7 2 0 1 S"
		],
		"France": [
			"1916 1916 5 14 7 23 2 1 S",
			"1916 1919 9 1 0 23 2 0",
			"1917 1917 2 24 7 23 2 1 S",
			"1918 1918 2 9 7 23 2 1 S",
			"1919 1919 2 1 7 23 2 1 S",
			"1920 1920 1 14 7 23 2 1 S",
			"1920 1920 9 23 7 23 2 0",
			"1921 1921 2 14 7 23 2 1 S",
			"1921 1921 9 25 7 23 2 0",
			"1922 1922 2 25 7 23 2 1 S",
			"1922 1938 9 1 6 23 2 0",
			"1923 1923 4 26 7 23 2 1 S",
			"1924 1924 2 29 7 23 2 1 S",
			"1925 1925 3 4 7 23 2 1 S",
			"1926 1926 3 17 7 23 2 1 S",
			"1927 1927 3 9 7 23 2 1 S",
			"1928 1928 3 14 7 23 2 1 S",
			"1929 1929 3 20 7 23 2 1 S",
			"1930 1930 3 12 7 23 2 1 S",
			"1931 1931 3 18 7 23 2 1 S",
			"1932 1932 3 2 7 23 2 1 S",
			"1933 1933 2 25 7 23 2 1 S",
			"1934 1934 3 7 7 23 2 1 S",
			"1935 1935 2 30 7 23 2 1 S",
			"1936 1936 3 18 7 23 2 1 S",
			"1937 1937 3 3 7 23 2 1 S",
			"1938 1938 2 26 7 23 2 1 S",
			"1939 1939 3 15 7 23 2 1 S",
			"1939 1939 10 18 7 23 2 0",
			"1940 1940 1 25 7 2 0 1 S",
			"1941 1941 4 5 7 0 0 2 M",
			"1941 1941 9 6 7 0 0 1 S",
			"1942 1942 2 9 7 0 0 2 M",
			"1942 1942 10 2 7 3 0 1 S",
			"1943 1943 2 29 7 2 0 2 M",
			"1943 1943 9 4 7 3 0 1 S",
			"1944 1944 3 3 7 2 0 2 M",
			"1944 1944 9 8 7 1 0 1 S",
			"1945 1945 3 2 7 2 0 2 M",
			"1945 1945 8 16 7 3 0 0",
			"1976 1976 2 28 7 1 0 1 S",
			"1976 1976 8 26 7 1 0 0"
		],
		"Latvia": [
			"1989 1996 2 0 8 2 2 1 S",
			"1989 1996 8 0 8 2 2 0"
		],
		"Bulg": [
			"1979 1979 2 31 7 23 0 1 S",
			"1979 1979 9 1 7 1 0 0",
			"1980 1982 3 1 6 23 0 1 S",
			"1980 1980 8 29 7 1 0 0",
			"1981 1981 8 27 7 2 0 0"
		],
		"Albania": [
			"1940 1940 5 16 7 0 0 1 S",
			"1942 1942 10 2 7 3 0 0",
			"1943 1943 2 29 7 2 0 1 S",
			"1943 1943 3 10 7 3 0 0",
			"1974 1974 4 4 7 0 0 1 S",
			"1974 1974 9 2 7 0 0 0",
			"1975 1975 4 1 7 0 0 1 S",
			"1975 1975 9 2 7 0 0 0",
			"1976 1976 4 2 7 0 0 1 S",
			"1976 1976 9 3 7 0 0 0",
			"1977 1977 4 8 7 0 0 1 S",
			"1977 1977 9 2 7 0 0 0",
			"1978 1978 4 6 7 0 0 1 S",
			"1978 1978 9 1 7 0 0 0",
			"1979 1979 4 5 7 0 0 1 S",
			"1979 1979 8 30 7 0 0 0",
			"1980 1980 4 3 7 0 0 1 S",
			"1980 1980 9 4 7 0 0 0",
			"1981 1981 3 26 7 0 0 1 S",
			"1981 1981 8 27 7 0 0 0",
			"1982 1982 4 2 7 0 0 1 S",
			"1982 1982 9 3 7 0 0 0",
			"1983 1983 3 18 7 0 0 1 S",
			"1983 1983 9 1 7 0 0 0",
			"1984 1984 3 1 7 0 0 1 S"
		],
		"Austria": [
			"1920 1920 3 5 7 2 2 1 S",
			"1920 1920 8 13 7 2 2 0",
			"1946 1946 3 14 7 2 2 1 S",
			"1946 1948 9 1 0 2 2 0",
			"1947 1947 3 6 7 2 2 1 S",
			"1948 1948 3 18 7 2 2 1 S",
			"1980 1980 3 6 7 0 0 1 S",
			"1980 1980 8 28 7 0 0 0"
		],
		"Mauritius": [
			"1982 1982 9 10 7 0 0 1 S",
			"1983 1983 2 21 7 0 0 0",
			"2008 2008 9 0 8 2 0 1 S",
			"2009 2009 2 0 8 2 0 0"
		],
		"WS": [
			"2012 9999 8 0 8 3 0 1 D",
			"2012 9999 3 1 0 4 0 0"
		],
		"NZ": [
			"1927 1927 10 6 7 2 0 1 S",
			"1928 1928 2 4 7 2 0 0 M",
			"1928 1933 9 8 0 2 0 0:30 S",
			"1929 1933 2 15 0 2 0 0 M",
			"1934 1940 3 0 8 2 0 0 M",
			"1934 1940 8 0 8 2 0 0:30 S",
			"1946 1946 0 1 7 0 0 0 S",
			"1974 1974 10 1 0 2 2 1 D",
			"1975 1975 1 0 8 2 2 0 S",
			"1975 1988 9 0 8 2 2 1 D",
			"1976 1989 2 1 0 2 2 0 S",
			"1989 1989 9 8 0 2 2 1 D",
			"1990 2006 9 1 0 2 2 1 D",
			"1990 2007 2 15 0 2 2 0 S",
			"2007 9999 8 0 8 2 2 1 D",
			"2008 9999 3 1 0 2 2 0 S"
		],
		"Chatham": [
			"1974 1974 10 1 0 2:45 2 1 D",
			"1975 1975 1 0 8 2:45 2 0 S",
			"1975 1988 9 0 8 2:45 2 1 D",
			"1976 1989 2 1 0 2:45 2 0 S",
			"1989 1989 9 8 0 2:45 2 1 D",
			"1990 2006 9 1 0 2:45 2 1 D",
			"1990 2007 2 15 0 2:45 2 0 S",
			"2007 9999 8 0 8 2:45 2 1 D",
			"2008 9999 3 1 0 2:45 2 0 S"
		],
		"Vanuatu": [
			"1983 1983 8 25 7 0 0 1 S",
			"1984 1991 2 23 0 0 0 0",
			"1984 1984 9 23 7 0 0 1 S",
			"1985 1991 8 23 0 0 0 1 S",
			"1992 1993 0 23 0 0 0 0",
			"1992 1992 9 23 0 0 0 1 S"
		],
		"Fiji": [
			"1998 1999 10 1 0 2 0 1 S",
			"1999 2000 1 0 8 3 0 0",
			"2009 2009 10 29 7 2 0 1 S",
			"2010 2010 2 0 8 3 0 0",
			"2010 9999 9 18 0 2 0 1 S",
			"2011 2011 2 1 0 3 0 0",
			"2012 9999 0 18 0 3 0 0"
		],
		"NC": [
			"1977 1978 11 1 0 0 0 1 S",
			"1978 1979 1 27 7 0 0 0",
			"1996 1996 11 1 7 2 2 1 S",
			"1997 1997 2 2 7 2 2 0"
		],
		"Cook": [
			"1978 1978 10 12 7 0 0 0:30 HS",
			"1979 1991 2 1 0 0 0 0",
			"1979 1990 9 0 8 0 0 0:30 HS"
		],
		"Tonga": [
			"1999 1999 9 7 7 2 2 1 S",
			"2000 2000 2 19 7 2 2 0",
			"2000 2001 10 1 0 2 0 1 S",
			"2001 2002 0 0 8 2 0 0"
		]
	},
	"links": {
		"America/Kralendijk": "America/Curacao",
		"America/Lower_Princes": "America/Curacao",
		"America/Marigot": "America/Guadeloupe",
		"America/Shiprock": "America/Denver",
		"America/St_Barthelemy": "America/Guadeloupe",
		"Antarctica/South_Pole": "Antarctica/McMurdo",
		"Arctic/Longyearbyen": "Europe/Oslo",
		"Europe/Bratislava": "Europe/Prague",
		"Europe/Busingen": "Europe/Zurich",
		"Europe/Guernsey": "Europe/London",
		"Europe/Isle_of_Man": "Europe/London",
		"Europe/Jersey": "Europe/London",
		"Europe/Ljubljana": "Europe/Belgrade",
		"Europe/Mariehamn": "Europe/Helsinki",
		"Europe/Podgorica": "Europe/Belgrade",
		"Europe/San_Marino": "Europe/Rome",
		"Europe/Sarajevo": "Europe/Belgrade",
		"Europe/Skopje": "Europe/Belgrade",
		"Europe/Vatican": "Europe/Rome",
		"Europe/Zagreb": "Europe/Belgrade"
	}
});/* global mixpanel */
'use strict';

//Setting up route
window.app.config(['$urlRouterProvider', '$stateProvider', '$FBProvider', 'MomentProvider',

	function($urlRouterProvider, $stateProvider, $FBProvider, MomentProvider) {
		$FBProvider.setInitParams({
			appId: '202887703204611'
		});

		mixpanel.init('4cbf26b4d154203d64f768d1be755667');

		MomentProvider
			.asyncLoading(false)
			.scriptUrl('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.3.1/moment.min.js');

		// $urlRouterProvider.otherwise('/');
		$stateProvider.state('mealplan', {
			url: '/mealplan',
			templateUrl: 'public/home/mealplan.html'
		}).state('settings', {
			url: '/settings',
			templateUrl: 'public/home/settings.html'
		}).state('index', {
			url: '/',
			templateUrl: 'public/home/home.html'
		}).state('index.login', {
			url: '-1',
		}).state('index.mealsPerWeek', {
			url: '1',
		}).state('index.daysAndTime', {
			url: '2'
		}).state('index.address', {
			url: '3'
		}).state('index.authType', {
			url: '4'
		}).state('index.loginInfo', {
			url: '5'
		}).state('index.paymentInfo', {
			url: '6'
		}).state('otherwise', {
			url: '/',
			templateUrl: 'public/home/home.html'
		});
	}
]);angular.module('mean.system').factory('Global', [

	function() {
		var _this = this,
			isMobile = false;

		if (navigator && navigator.userAgent && /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(navigator.userAgent)) {
			isMobile = window.isMobile = true;
		}

		_this._data = {
			user: window.user,
			authenticated: !! window.user,
			public: true,
			isMobile: isMobile
		};


		return _this._data;
	}
]);