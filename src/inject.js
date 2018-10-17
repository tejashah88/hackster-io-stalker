$(document).ready(function() {
  var projectListSelector = '.project-card:not(:has(div.enter-challenge), :has(a.enter-challenge))';

  if ($(projectListSelector).length) {
    var mainContestLink = window.location.href.split('/').slice(0, 5).join('/') + '/brief';
    $.get(mainContestLink).then(mainProjectPageData => {
      var timelineObj = $('.section-thumbs', mainProjectPageData).last();
      // get the project starting date
      var startDateString = $('p', timelineObj).eq(1).text().split('at')[0].trim();
      var startDate = new Date(startDateString);

      // we don't want the first card, which is for the user to register for the challenge
      $(projectListSelector).each(function() {
        var projectObj = this;
        var projectLink = 'https://www.hackster.io' + $('h4 > .project-link-with-ref', this).attr('href');

        $.get(projectLink).then(projectPageData => {
          // retrieve the project published date
          var possiblePubDate1 = $('[itemprop=datePublished]', projectPageData).text();
          var possiblePubDate2 = $('[itemprop=dateCreated]', projectPageData).text();
          var pubDateString = (possiblePubDate1 || possiblePubDate2).trim();
          var pubDate = new Date(pubDateString);

          var psaStyle = 'font-size:12px; white-space: pre-line';
          if (pubDate.getTime() < startDate.getTime()) {
            // exposed!!
            $(projectObj).css('background', '#FD0');
            var pubDatePSA = `<div style="${psaStyle}">Project published on ${pubDateString}</div>`;
            var startDatePSA = `<div style="${psaStyle}">Contest started on ${startDateString}</div>`;
            $(".spacer", projectObj).html(pubDatePSA + startDatePSA);
          }
        });
      });
    });
  }
});