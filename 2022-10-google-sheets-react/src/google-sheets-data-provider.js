export default async function getData() {

  // https://stackoverflow.com/questions/31765773/converting-google-visualization-query-result-into-javascript-array
  // https://developers.google.com/chart/interactive/docs/dev/implementing_data_source#responseformat

  const spreadsheetId = '1lipvFbBqi0PhyeNMik6rhgYnBRlg4aJFX6LdjXvwBTQ',

    response = await fetch(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json`),
    result = await response.text(),
    json = JSON.parse(result.replace(/.*google.visualization.Query.setResponse\({(.*?)}\);?/s, '{$1}'));

  // console.log(json);

  // `table.cols` element contains headings
  // we will use them to build our data array
  const headings = json.table.cols.map(item => item.label);

  // console.log(headings);

  // data of each row is associated to the headings
  let data = json.table.rows.map(item => {
    // console.log(item);
    let row = {};
    item.c.forEach((cell, idx) => {
      row[headings[idx]] = cell?.v?? null;
    });
    return row;
  });

  // filtering and sorting
  data = data.filter(item => item.Publish === true);
  data.sort((a, b) => a.CategoryOrder > b.CategoryOrder);

  // console.log(data);

  /*
    Fields:
    -------------------
    Category
    Name
    Description
    Price
    Publish
    CategoryOrder
    CategoryTranslation
  */

  // aggregating data by category
  data = [...new Set(data.map(item => item.CategoryOrder))].map(categoryIndex => {
    return data.filter(item => item.CategoryOrder === categoryIndex);
  });


  return data;

}
