/* file used only for sorting data in table */
export const sortData = (data) => {
    const sortedData = [...data];

    sortedData.sort((a,b) => {
        if(a.cases > b.cases) {
            return -1; //since we want the highest number of cases on top (descending order of sorting)..
        }
            else{
                return 1;
            }

    })
    return sortedData;
}
