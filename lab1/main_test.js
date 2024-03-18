const test = require('node:test');
const assert = require('assert');
const { MyClass, Student } = require('./main');

test("Test MyClass's addStudent", () => {
    try {
        const myClass = new MyClass();
        const student = new Student();
        student.setName("John");
        const studentId = myClass.addStudent(student);
        assert.equal(studentId, 0);
        assert.equal(myClass.getStudentById(0).getName(), "John");
    }
    catch (error) {
        console.error(error);
    }
});

test("Test MyClass's getStudentById", () => {
    try {
        const myClass = new MyClass();
        const names = ['John', 'Jane', 'Doe', 'Smith'];
        names.forEach(name => {
            const student = new Student();
            student.setName(name);
            myClass.addStudent(student);
        });
        names.forEach((name,index) => {
            assert.equal(myClass.getStudentById(index).getName(), name);
        })
    }
    catch (error) {
        console.error(error);
    }
});

test("Test Student's setName", () => {
    try {
        const student = new Student();
        let studentName = 'John';
        student.setName(studentName);
        assert.equal(student.getName(), studentName);
    }
    catch (error) {
        console.error(error);
    }
});

test("Test Student's getName", () => {
    try {
        const student = new Student();
        assert.equal(student.getName(), '');
    }
    catch (error) {
        console.error(error);
    }
});