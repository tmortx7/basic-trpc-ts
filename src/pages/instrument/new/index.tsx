import { Box, Flex, Stack } from "@chakra-ui/react";
import { InputControl, SelectControl, SubmitButton } from "../../../components";
import { NextPage } from "next";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { IInstrumentISA, InstrumentISASchema } from "../../../schema/instrumentisa.schema";

const initialValues = {
  nmvId: "",
  instfunctionId: "",
  description: "",
};

const CreateInstrumentPage: NextPage = () => {
  const router = useRouter();
  const mutation = trpc.instrument.add.useMutation();

  const mvQuery = trpc.measuredvariable.list.useQuery();
  const funcQuery = trpc.instrumentfunction.list.useQuery();

  return (
    <div>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Box bg="white" p={6} rounded="md">
          Create Instrument
        <Formik
          initialValues={initialValues}
          onSubmit={async(values: IInstrumentISA) => {
            mutation.mutate(values);
            console.log(values)
            router.push("/instrument");
          }}
          validationSchema={toFormikValidationSchema(InstrumentISASchema)}
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
                  label="Measured Variable"
                  name="mvId"
                  selectProps={{ placeholder: "Select MV" }}
                >
                  {mvQuery.data?.map((mvx: any) => (
                    <option value={mvx.id}>{mvx.variable}-{mvx.mvalias}</option>
                  ))}
                </SelectControl>
                <SelectControl
                  label="Instrument Function"
                  name="instfunctionId"
                  selectProps={{ placeholder: "Select Function" }}
                >
                  {funcQuery.data?.map((funcx: any) => (
                    <option value={funcx.id}>{funcx.instrumentfunction}-{funcx.alias}</option>
                  ))}
                </SelectControl>

              <InputControl
                name="description"
                label="Description"
                inputProps={{ autoComplete: "off" }}
              />
              <SubmitButton colorScheme={"blue"}>Submit</SubmitButton>
            </Stack>
          )}
        </Formik>
        </Box>
      </Flex>
    </div>
  );
};

export default CreateInstrumentPage;