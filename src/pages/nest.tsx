import { Container, List, ListItem } from "@chakra-ui/react";
import { trpc } from "../utils/trpc";

const ListItemValue = ({ item }) => {
  return (
    <>
      <ListItem>{item}</ListItem>
    </>
  );
};

const NestPage = () => {
  const { data, isLoading } = trpc.measuredvariable.list.useQuery();
  if (isLoading) {
    return <p> Loading...</p>;
  }
  return (
    <div>
      <Container alignContent={"center"} mt="10">
        <List spacing={1} >
          {data.map((item: any) => (
            <ListItemValue key={item.id} item={item.variable} />
          ))}
        </List>
      </Container>
    </div>
  );
};

export default NestPage;
