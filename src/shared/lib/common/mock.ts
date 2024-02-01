export const createMockMachine = <T, P = void>(
  values: ((prev: T | undefined, payload: P) => T)[],
  name?: string,
) => {
  const machine = (payload: P) => {
    let mockData: T | undefined = undefined;
    let error: Error | undefined = undefined;

    try {
      mockData = values[machine.position](machine.lastValue, payload);
    } catch (e) {
      error = e as Error;
    }

    console.info(
      `[mock][${name || 'unknown'}]`,
      'position:',
      machine.position,
      ',payload',
      payload,
      ',data:',
      mockData,
      ',error:',
      error,
    );

    machine.position =
      machine.position + 1 > values.length - 1 ? 0 : machine.position + 1;
    machine.lastValue = mockData == null ? machine.lastValue : mockData;

    if (error) {
      throw error;
    }

    return mockData as T;
  };

  machine.position = 0;
  machine.lastValue = undefined as undefined | T;

  return machine;
};
