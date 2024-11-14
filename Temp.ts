import React, { useContext } from 'react';
import { AppContext } from './AppContext';

const ExampleComponent: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) {
        return <p>Error: Context not found</p>;
    }

    const { data, loading, error } = context;

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h2>Fetched Data:</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default ExampleComponent;