import type { NextPage } from "next";
import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Box,
  Flex,
  IconButton,
  LinkOverlay,
  LinkBox,
  Select,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const InstrumentTypeListPage: NextPage = () => {
  const [value, setValue] = React.useState("flow");
  const utils = trpc.useContext();
  const mutation = trpc.measuredvariable.delete.useMutation({
    async onSuccess() {
      await utils.measuredvariable.list.invalidate();
    },
  });
  const mvQuery = trpc.measuredvariable.list.useQuery();
  const variable = value;
  const { data, isLoading, error } = trpc.measuredvariable.byVariable.useQuery({
    variable,
  });
  if (isLoading) {
    return <p> Loading...</p>;
  }

  if (error) {
    return <p>Error....</p>;
  }

  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <Head>
        <title>List of Measured Variables</title>
        <meta name="description" content="measuredvariables" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex bg="gray.100" align="center" justify="center" h="100vh">
          <Box>
            <Select mb="12" value={value} onChange={handleChange}>
              {mvQuery.data?.map((mvx: any) => (
                <option value={mvx.variable}>{mvx.variable}</option>
              ))}
            </Select>
            <TableContainer>
              <Table variant="striped" colorScheme="gray 300">
                <Thead>
                  <Tr>
                    <Th>Variable</Th>
                    <Th>Edit</Th>
                    <Th>Delete</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.instruments.map(({ id, description }) => (
                    <Tr key={id}>
                      <Td>{description}</Td>
                      <Td>
                        <LinkBox>
                          <LinkOverlay href={`/instrumenttype/edit/${id}`}>
                            <IconButton
                              aria-label="Delete measuredvariable"
                              size="sm"
                              icon={<EditIcon />}
                            />
                          </LinkOverlay>
                        </LinkBox>
                      </Td>
                      <Td>
                        <IconButton
                          aria-label="Delete measuredvariable"
                          size="sm"
                          icon={<DeleteIcon />}
                          onClick={() => mutation.mutate({ id })}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Flex>
      </main>
    </div>
  );
};

export default InstrumentTypeListPage;
