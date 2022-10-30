import { Container, List, ListItem } from "@chakra-ui/react"
import { trpc } from "../utils/trpc";


const Details = (props) => {
  return(
    <div>
      <List>
        <ListItem>{props.p.variable}</ListItem>
      </List>
    </div>
  )
}

const NestGroup = () => {
  const { data, isLoading } = trpc.measuredvariable.list.useQuery();
  if (isLoading) {
    return <p> Loading...</p>;
  }
  const Values= data.map((mv:any)=>
    <Details key={mv.id} p={mv} />)
  return(
    <div>
      <Container alignContent={"center"} mt="20">
        {Values}
      </Container>
    </div>
  )
}

export default NestGroup