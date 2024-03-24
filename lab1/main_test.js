const test = require('node:test');
const assert = require('assert');
const { MyClass, Student } = require('./main');




test("Test MyClass's addStudent", () => {

        const myClass = new MyClass();
        const sam = new Student();
        sam.setName('Sam')
        const result = myClass.addStudent(sam)
        assert.strictEqual(result,0)

        const  emptyStudent = myClass.addStudent(100.12)
        assert.strictEqual(emptyStudent,-1)

});

test("Test MyClass's getStudentById", () => {

 
        const myClass = new MyClass();
        const sam = new Student(); 
        sam.setName("sam")
        myClass.addStudent(sam)
        const retrieveStudent = myClass.getStudentById(0)
        assert.strictEqual(retrieveStudent,sam)

        const retrieveEmpty1 =  myClass.getStudentById(-1)
        assert.strictEqual(retrieveEmpty1,null)

        const retrieveEmpty2 =  myClass.getStudentById(1)
        assert.strictEqual(retrieveEmpty2,null)

});

test("Test Student's setName", () => {
    

        const student = new Student();

        student.setName(123)
        assert.strictEqual(student.name,undefined)


        student.setName("Sam")
        assert.strictEqual(student.name,"Sam")

});

test("Test Student's getName", () => {
    
    
        const student = new Student();
        assert.strictEqual(student.getName(),'')


        student.setName("Sam")
        assert.strictEqual(student.getName(),"Sam")

  
});
