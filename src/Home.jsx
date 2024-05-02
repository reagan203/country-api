import { useState } from "react";
import axios from "axios";
import {
  Flex,
  VStack,
  Heading,
  Input,
  Button,
  Text,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const apiKey = process.env.REACT_APP_COUNTRY_API_KEY; // Access environment variable
const baseUrl = process.env.REACT_APP_COUNTRY_API_URL; // Access environment variable




const Home = () => {
  console.log("Base URL:", baseUrl); // Should print a valid URL
  console.log("API Key:", apiKey); // Should print the correct API key

  const [country, setCountry] = useState("");
  const [countryData, setCountryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setCountry(event.target.value);
  };

  const fetchCountryData = async () => {
    const fullUrl = `${baseUrl}${country}`; // Use baseUrl and append query parameters

    setIsLoading(true);
    setError(null);
    setCountryData(null);

    try {
      const response = await axios.get(fullUrl, {
        headers: {
          "X-Api-Key": apiKey,
        },
      });

      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        setCountryData(data[0]); // Get the first country data item
      } else {
        setError("No country data found.");
      }
    } catch (error) {
      setError("Error fetching country data.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (country.trim() !== "") {
      fetchCountryData();
    }
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgGradient="linear(to-r, blue.400, blue.500)"
      color="black"
    >
      <VStack
        spacing={8}
        padding={8}
        bg="whiteAlpha.900"
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading mb={4} color="blue.600">
          Countries App
        </Heading>
        
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Enter country name"
            value={country}
            onChange={handleInputChange}
            mb={4}
            variant="filled"
            borderColor="gray.400"
            borderWidth="2px"
          />
          <Button type="submit" colorScheme="blue">
            Get Country
          </Button>
        </form>

        {isLoading && <Spinner />} 
        
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {countryData && (
          <VStack spacing={4} alignItems="center">
            <Heading size="md">Country Data: {countryData.name}</Heading>
            {countryData.currency && (
              <Text>Currency: {countryData.currency.name}</Text>
            )}
            <Text>Population: {countryData.population}</Text>
            <Text>GDP: {countryData.gdp}</Text>
          </VStack>
        )}
      </VStack>
    </Flex>
  );
};

export default Home;


