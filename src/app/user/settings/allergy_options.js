const allergyOptions = [
    {value: 'peanuts', label: 'Peanuts'},
    {value: 'shellfish', label: 'Shellfish'},
    {value: 'lactose', label: 'Lactose'},
    {value: 'treeNuts', label: 'Tree Nuts'},
    {value: 'soy', label: 'Soy'},
    {value: 'wheat', label: 'Wheat'},
    {value: 'fish', label: 'Fish'},
    {value: 'eggs', label: 'Eggs'},
    {value: 'gluten', label: 'Gluten'},
    {value: 'dairy', label: 'Dairy'},
    {value: 'sesame', label: 'Sesame'},
    {value: 'corn', label: 'Corn'},
    {value: 'mustard', label: 'Mustard'},
    {value: 'sulfites', label: 'Sulfites'},
    {value: 'celery', label: 'Celery'},
    {value: 'garlic', label: 'Garlic'},
    {value: 'onion', label: 'Onion'},
    {value: 'strawberries', label: 'Strawberries'},
    {value: 'citrusFruits', label: 'Citrus Fruits'},
    {value: 'bananas', label: 'Bananas'},
    {value: 'kiwi', label: 'Kiwi'},
    {value: 'apple', label: 'Apple'},
    {value: 'tomato', label: 'Tomato'},
    {value: 'chicken', label: 'Chicken'},
    {value: 'pork', label: 'Pork'},
    {value: 'beef', label: 'Beef'},
];


export default allergyOptions.sort((a, b) => a.label.localeCompare(b.label));;