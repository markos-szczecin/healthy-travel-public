const diseaseOptions = [
    {value: 'diabetes', label: 'Diabetes'},
    {value: 'hypertension', label: 'Hypertension'},
    {value: 'celiac', label: 'Celiac Disease'},
    {value: 'obesity', label: 'Obesity'},
    {value: 'coronaryArteryDisease', label: 'Coronary Artery Disease'},
    {value: 'hyperlipidemia', label: 'Hyperlipidemia'},
    {value: 'anemia', label: 'Anemia'},
    {value: 'osteoporosis', label: 'Osteoporosis'},
    {value: 'diverticulitis', label: 'Diverticulitis'},
    {value: 'gallstones', label: 'Gallstones'},
    {value: 'kidneyDisease', label: 'Kidney Disease'},
    {value: 'irritableBowelSyndrome', label: 'Irritable Bowel Syndrome'},
    {value: 'ulcerativeColitis', label: 'Ulcerative Colitis'},
    {value: 'CrohnsDisease', label: 'Crohn\'s Disease'},
    {value: 'gout', label: 'Gout'},
    {value: 'lactoseIntolerance', label: 'Lactose Intolerance'},
    {value: 'nonAlcoholicFattyLiverDisease', label: 'Non-Alcoholic Fatty Liver Disease'},
    {value: 'acidReflux', label: 'Acid Reflux'},
    {value: 'foodAllergies', label: 'Food Allergies'},
    {value: 'hyperthyroidism', label: 'Hyperthyroidism'},
    {value: 'hypothyroidism', label: 'Hypothyroidism'},
    {value: 'metabolicSyndrome', label: 'Metabolic Syndrome'},
    {value: 'pancreatitis', label: 'Pancreatitis'},
    {value: 'pepticUlcerDisease', label: 'Peptic Ulcer Disease'},
];


export default diseaseOptions.sort((a, b) => a.label.localeCompare(b.label));;