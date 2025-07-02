import { useNavigate } from "react-router-dom";

const NotFound = () => {
const navigate = useNavigate()
    const handleonclick = () =>{
        navigate(-1)
    }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          {/* <Button
            as={Link}
            to="/"
            variant="primary"
            icon={Home}
          >
            Go Home
          </Button>
          <Button
            as={Link}
            to="#"
            onClick={() => window.history.back()}
            variant="outline"
            icon={ArrowLeft}
          >
            Go Back
          </Button> */}
        <button onClick={handleonclick}>Go back</button>
          
        </div>
      </div>
    </div>
  );
};

export default NotFound;
