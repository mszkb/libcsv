export default class libcsv {
  constructor () {
    this.delimiter = ';'
  }

  /**
   * Splits up the CSV text for vuetable
   *
   * 1) extractFirstLine - fill up tableFields (table header)
   * 2) extractContentWithoutFirstLine - the Content itself
   *
   * @param text
   */
  splitTextIntoTable (text) {
    const firstLineArray = this.getColumnHeader(text)
    const contentArray = this.getRows(text)
    const contentObject = this.createContentForTable(firstLineArray, contentArray)

    this.fields = firstLineArray
    this.data = contentObject
  }

  /**
   * Extracting and returning the first line of the csv text
   * TODO default name for columns without name
   *
   * @param text - the whole csv file
   * @return first line of the csv file - these are the column names
   * @see Client\src\vuestic-theme\vuestic-components\vuestic-datatable\data\fields-definition.js
   */
  getColumnHeader ( text) {
    if (text === '') {
      return null
    }

    const firstLine = text.split('\n').shift()              // File needs to be LF (\n), TODO check how to split \r\n aswell
    const firstLineArray = firstLine.split(this.delimiter)       // split up into an array
    const firstLineObject = this.arrayToObject(firstLineArray)   // vuetable needs an object
    return firstLineObject
  }

  /**
   * Returns a 2D array of data where each index contains the data of the whole column
   *
   * @param text
   * @returns {null}
   */
  getDataByColumn (text) {
    if (text === '')
      return null

    let newArray = []
    const lines = text.split('\n')
    lines.splice(0, 1)

    lines.forEach((linesE, linesIndex) => {
      let rowArray = linesE.split(this.delimiter)
      rowArray.forEach((rowE, rowIndex) => {
        if(newArray[rowIndex] === undefined) {
          newArray.push([])
        }
        newArray[rowIndex].push(rowE)
      })
    })

    return newArray
  }

  /**
   * Removes the first line of the text String
   * then make an 2d array for row and content
   * TODO default name for columns without name
   *
   * @param text
   * @return csv file without the first line - first line are the column names
   */
  getRows (text) {
    const lines = text.split('\n')            // split up into rows
    lines.splice(0, 1)                        // remove first Line
    let lineArray = []
    for (const row of lines) {
      // make a 2d array by splitting up each row by the delimiter (; default)
      // split creates an array for each splitted element
      lineArray.push(row.split(this.delimiter))
    }
    return lineArray
  }
  countRows (text) {
    const lines = text.split('\n')            // split up into rows
    return lines.length
  }

  createContentForTable (firstLineArray, contentArray) {
    // dataObject is the data[] array which have to filled with objects
    // single is the object which gets properties from firstLineArray
    // the values getting from each element of the contentArray (row)

    let dataObject = []
    for (const contentRow of contentArray) {
      let single = { }
      // destructuring syntax - https://stackoverflow.com/a/34349073
      for (const [index, column] of firstLineArray.entries()) {
        // assigning the headername as property for the row element
        single[column.name] = contentRow[index]
      }
      dataObject.push(single)
    }

    return {
      data: dataObject
    }
  }

  arrayToObject (array) {
    let obj = array.map(x => this.makeObject(x))
    return obj
  }

  makeObject (single) {
    return {
      name: single,
      title: `${single}`,
    }
  }
}
