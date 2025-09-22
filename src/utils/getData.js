const API = 'https://raw.githubusercontent.com/flybondi/dev-challenge/refs/heads/master/dataset.json';

const getData = async () => {
    try{
        const response = await fetch(API);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Fetch error', error)
        return [];
    }
}
export default getData;