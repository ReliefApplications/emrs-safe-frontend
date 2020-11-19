/*  Edit general settings of SurveyJS
*/
export function initCreatorSettings(survey: any): void {
    survey.Serializer.findProperty('question', 'name').readOnly = true;
    survey.Serializer.findProperty('question', 'name').dependsOn = 'valueName';
    survey.Serializer.findProperty('question', 'name').onGetValue = (obj) => {
        return obj.valueName;
    };
    survey.Serializer.findProperty('question', 'valueName').isRequired = true;
}