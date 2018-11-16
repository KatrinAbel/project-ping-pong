
$(document).ready(function() {
let h1 = $(".target").text()
console.log(h1)
let h2 = $(".nav-header").text(h1)
$(".target").css("visibility:hidden");
console.log(h2) 
});