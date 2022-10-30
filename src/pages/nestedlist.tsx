import { Container, List, ListItem, Text } from "@chakra-ui/react";
import { trpc } from "../utils/trpc";

const NestedListPage = () => {
  const { data, isLoading } = trpc.measuredvariable.list.useQuery();
  if (isLoading) {
    return <p> Loading...</p>;
  }

  return (
    <div>
      <Container alignContent={"center"}>
        <div>
          {data.map((value: any) => (
            <List mt="3">
              <ListItem>
                <Text fontWeight="bold">{value.variable}</Text>
              </ListItem>
              {value.instruments.map((subx) => {
                return (
                  <ListItem>
                    <Text mx="5">{subx.description}</Text>
                  </ListItem>
                );
              })}
            </List>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default NestedListPage;
