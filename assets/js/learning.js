export class LearningEngine {
 constructor(){this.version='0.1';}
 analyze(prediction,result){return {correct:prediction===result};}
 getStatus(){return {ready:false,message:'Learning Engine en préparation'};}
}
