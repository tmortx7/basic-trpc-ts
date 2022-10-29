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
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const MeasuredVariableListPage: NextPage = () => {
  const utils = trpc.useContext();
  const mutation = trpc.measuredvariable.delete.useMutation({
    async onSuccess() {
      await utils.measuredvariable.list.invalidate();
    },
  });
  const { data, isLoading } = trpc.measuredvariable.list.useQuery();
  if (isLoading) {
    return <p> Loading...</p>;
  }

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
            <TableContainer>
              <Table variant="striped" colorScheme="gray 300">
                <Thead>
                  <Tr>
                    <Th>Variable</Th>
                    <Th>Alias</Th>
                    <Th>Edit</Th>
                    <Th>Delete</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.map(({ id, variable, mvalias}) => (
                    <Tr key={id}>
                      <Td>{variable}</Td>
                      <Td>{mvalias}</Td>
                      <Td>
                        <LinkBox>
                          <LinkOverlay href={`/measuredvariable/edit/${id}`}>
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

export default MeasuredVariableListPage;