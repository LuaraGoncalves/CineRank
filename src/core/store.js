export function createStore(initialState = {}) {
    let state = initialState;
    const listeners = new Set();

    return {
        getState() {
            return state;
        },
        
        setState(newState) {
            state = { ...state, ...newState };
            listeners.forEach(listener => listener(state));
        },
        
        subscribe(listener) {
            listeners.add(listener);
            listener(state); // Dispara imediatamente com o estado atual
            
            // Retorna função de unsubscribe
            return () => {
                listeners.delete(listener);
            };
        }
    };
}