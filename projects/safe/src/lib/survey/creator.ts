/*  Edit general settings of SurveyJS
*/
export function initCreatorSettings(survey: any): void {
    survey.Serializer.findProperty('question', 'valueName').readOnly = true;
    survey.Serializer.findProperty('question', 'valueName').dependsOn = 'name';
    survey.Serializer.findProperty('question', 'valueName').onGetValue = (obj: any) => {
        return obj.name ? obj.name : obj.valueName;
    };
    survey.Serializer.findProperty('question', 'name').isRequired = true;
    survey.Serializer.findProperty('file', 'storeDataAsText').onGetValue = (obj: any) => {
        return false;
    };
    survey.Serializer.findProperty('file', 'storeDataAsText').readOnly = true;
    survey.Serializer.findProperty('file', 'storeDataAsText').visible = false;
}
