import { Box, Button, ButtonGroup, Flex, Stack } from "@chakra-ui/react";
import { InputControl, SelectControl, SubmitButton } from "../../../components";
import { NextPage } from "next";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { IInstrumentTag, InstrumentTagSchema } from "../../../schema/instrumenttag.schema";


const initialValues = {
  tag: "",
  equipmentId: "",
  instrumenttypeId: "",
};

const CreateInstrumentTagPage: NextPage = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const mutation = trpc.instrumenttag.add.useMutation({
    async onSuccess() {
      await utils.instrumenttag.list.invalidate();
    },
  });
  const equipQuery = trpc.equipment.list.useQuery();
  const instrumenttypeQuery = trpc.instrumenttype.list.useQuery();
  return (
    <div>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Box bg="white" p={6} rounded="md">
          Create Instrument Tag
          <Formik
            initialValues={initialValues}
            onSubmit={async (values: IInstrumentTag) => {
              mutation.mutate(values);
              console.log(values);
              router.push("/instrumenttag");
            }}
            validationSchema={toFormikValidationSchema(InstrumentTagSchema)}
          >
            {({ handleSubmit }) => (
              <Stack
                spacing={5}
                borderWidth="1px"
                rounded="lg"
                shadow="1px 1px 3px rgba(0,0,0,0.3)"
                maxWidth={400}
                p={6}
                m="10px auto"
                as="form"
                onSubmit={handleSubmit as any}
              >
                 <SelectControl
                  label="Equipment"
                  name="equipmentId"
                  selectProps={{ placeholder: "Select Equipment" }}
                >
                  {equipQuery.data?.map((equipx: any) => (
                    <option value={equipx.id}>
                      {equipx.description}
                    </option>
                  ))}
                </SelectControl>
                <SelectControl
                  label="Instrument Type"
                  name="instrumenttypeId"
                  selectProps={{ placeholder: "Select Instrument type" }}
                >
                  {instrumenttypeQuery.data?.map((typex: any) => (
                    <option value={typex.id}>{typex.description}</option>
                  ))}
                </SelectControl>
                <InputControl
                  name="tag"
                  label="Tag"
                  inputProps={{ autoComplete: "off" }}
                />

                 <ButtonGroup>
                  <SubmitButton colorScheme={"blue"}>Submit</SubmitButton>
                  <Button onClick={() => router.push("/instrumenttag")}>
                    Cancel
                  </Button>
                </ButtonGroup>
              </Stack>
            )}
          </Formik>
        </Box>
      </Flex>
    </div>
  );
};

export default CreateInstrumentTagPage;
