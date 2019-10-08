const { run, clear } = require('../../lib/jobs-runner');
const sleep = interval => new Promise((res) => setTimeout(res, interval));

test('run job at fixed interval', async () => {
    const getStub = jest.fn().mockResolvedValueOnce(42).mockResolvedValueOnce(21);
    const storeStub = jest.fn().mockResolvedValue({});

    run([{
        name: 'test',
        getValue: getStub,
        storeValue: storeStub,
        interval: 50
    }]);

    await sleep(120);
    clear();

    expect(getStub.mock.calls.length).toBe(2);
    expect(storeStub.mock.calls.length).toBe(2);
    expect(storeStub.mock.calls[0][0]).toBe(42);
    expect(storeStub.mock.calls[1][0]).toBe(21);
});

test('run several jobs', async () => {
    const getStub1 = jest.fn().mockResolvedValue(42);
    const getStub2 = jest.fn().mockResolvedValue(43);
    const storeStub1 = jest.fn().mockResolvedValue({});
    const storeStub2 = jest.fn().mockResolvedValue({});

    run([{
        name: 'test1',
        getValue: getStub1,
        storeValue: storeStub1,
        interval: 50
    },
    {
        name: 'test2',
        getValue: getStub2,
        storeValue: storeStub2,
        interval: 90
    }]);

    await sleep(120);
    clear();

    expect(getStub1.mock.calls.length).toBe(2);
    expect(storeStub1.mock.calls.length).toBe(2);
    expect(storeStub1.mock.calls[0][0]).toBe(42);
    expect(storeStub1.mock.calls[1][0]).toBe(42);

    expect(getStub2.mock.calls.length).toBe(1);
    expect(storeStub2.mock.calls.length).toBe(1);
    expect(storeStub2.mock.calls[0][0]).toBe(43);
});

test('no run after clear', async () => {
    const getStub = jest.fn().mockResolvedValue(42);
    const storeStub = jest.fn().mockResolvedValue({});

    run([{
        name: 'test',
        getValue: getStub,
        storeValue: storeStub,
        interval: 50
    }]);

    await sleep(120);
    clear();
    await sleep(100);

    expect(getStub.mock.calls.length).toBe(2);
    expect(storeStub.mock.calls.length).toBe(2);
});

test('no crash if get value fails', async () => {
    const getStub = jest.fn().mockRejectedValueOnce(new Error('MDR')).mockResolvedValueOnce(21);
    const storeStub = jest.fn().mockResolvedValue({});

    run([{
        name: 'test',
        getValue: getStub,
        storeValue: storeStub,
        interval: 50
    }]);

    await sleep(120);
    clear();

    expect(getStub.mock.calls.length).toBe(2);
    expect(storeStub.mock.calls.length).toBe(1);
    expect(storeStub.mock.calls[0][0]).toBe(21);
});