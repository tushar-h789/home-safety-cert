import React, { useEffect, useState } from 'react';

const GoogleMap: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure the map is only rendered on the client-side
  }, []);

  if (!isMounted) {
    return null; // Prevent SSR issues by rendering nothing on the server
  }

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <iframe
        width="100%"
        height="600"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=united%20kingdom+(Home%20safety)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        allowFullScreen
      />
    </div>
  );
};

export default GoogleMap;
