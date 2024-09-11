const dietOptions = [
    {value: 'vegetarian', label: 'Vegetarian'},
    {value: 'vegan', label: 'Vegan'},
    {value: 'glutenFree', label: 'Gluten Free'},
    {value: 'ketogenic', label: 'Ketogenic'},
    {value: 'paleo', label: 'Paleo'},
    {value: 'pescatarian', label: 'Pescatarian'},
    {value: 'lowCarb', label: 'Low Carb'},
    {value: 'lowFat', label: 'Low Fat'},
    {value: 'whole30', label: 'Whole30'},
    {value: 'dairyFree', label: 'Dairy Free'},
    {value: 'nutFree', label: 'Nut Free'},
    {value: 'soyFree', label: 'Soy Free'},
    {value: 'halal', label: 'Halal'},
    {value: 'kosher', label: 'Kosher'},
    {value: 'mediterranean', label: 'Mediterranean'},
    {value: 'omnivore', label: 'Omnivore'},
    {value: 'rawVegan', label: 'Raw Vegan'},
    {value: 'paleoVegan', label: 'Paleo Vegan'},
    {value: 'lactoVegetarian', label: 'Lacto-Vegetarian'},
    {value: 'ovoVegetarian', label: 'Ovo-Vegetarian'},
    {value: 'paleoPescatarian', label: 'Paleo Pescatarian'},
    {value: 'fruitarian', label: 'Fruitarian'},
    {value: 'plantBased', label: 'Plant-Based'},
    {value: 'flexitarian', label: 'Flexitarian'},
];


export default dietOptions.sort((a, b) => a.label.localeCompare(b.label));;