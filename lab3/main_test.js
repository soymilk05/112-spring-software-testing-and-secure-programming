const {test,mock} = require('node:test');
const assert = require('assert');
const fs = require('fs')
mock.method(fs, 'readFile', (file, options, callback) => {
    callback(null, 'sam\njack\njim');
});
const { Application, MailSystem } = require('./main');



test('write', () => {
    const mailSystem = new MailSystem()
    assert.strictEqual(mailSystem.write('sam'),'Congrats, sam!')
    assert.strictEqual(mailSystem.write(123),'Congrats, 123!')
    assert.strictEqual(mailSystem.write(null),'Congrats, null!')

});


test('send',()=>{
    const mailSystem = new MailSystem()
    mock.method(Math, 'random', () => 0.9);
    assert.strictEqual(mailSystem.send('sam','hello world'),true)
    mock.method(Math, 'random', () => 0.1);
    assert.strictEqual(mailSystem.send('sam','hello world'),false)
})


test('getNames', async () => {
    const app = new Application();
    const names = await app.getNames();
    assert.deepStrictEqual(names, [['sam', 'jack','jim'],[]]);
});


test('getRandomPerson',async ()=>{
    const app = new Application();
    await app.getNames();
    mock.method(Math,'random',()=>0.5)
    const person = app.getRandomPerson()
    assert.strictEqual(person,app.people[Math.floor(0.5*app.people.length)])
})



test('selectNextPerson', async ()=>{
    const app = new Application();
    await app.getNames();
    app.selected = ['sam']
    let i = 0
    mock.method(app, 'getRandomPerson', () => app.people[i++]);
    assert.strictEqual(app.selectNextPerson(),'jack')
    assert.strictEqual(app.selectNextPerson(),'jim')
    assert.strictEqual(app.selectNextPerson(),null)
})



test('notifySelected',async ()=>{
    const app = new Application();
    const [names] = await app.getNames();
    app.selected = names.slice();
    app.mailSystem.send = mock.fn(app.mailSystem.send);
    app.mailSystem.write = mock.fn(app.mailSystem.write);
    app.notifySelected();
    assert.strictEqual(app.mailSystem.send.mock.calls.length, names.length);
    assert.strictEqual(app.mailSystem.write.mock.calls.length, names.length);
})
