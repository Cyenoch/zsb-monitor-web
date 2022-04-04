import { MaybeRef } from "@vueuse/core";
import axios from "axios";
import { isRef, ref, watch } from "vue";
import client from "../client";

export default function useClient(url: MaybeRef<string>, options: MaybeRef<any> = {}) {
  const data = ref()
  const isLoading = ref(false)
  const abortController = ref(new AbortController())
  const error = ref()

  async function fetchData() {
    try {
      error.value = null;
      if (isLoading.value) {
        abortController.value.abort();
      }
      isLoading.value = true
      abortController.value = new AbortController();
      const result = await client.get(isRef(url) ? url.value : url, {
        signal: abortController.value.signal,
        ...(isRef(options) ? options.value : options)
      })
      data.value = result.data;
      isLoading.value = false;
    } catch (err) {
      if (axios.isCancel(err)) {
        return
      }
      error.value = err;
      isLoading.value = false;
    }
  }

  if (isRef(url)) {
    watch([url], fetchData);
  }

  if (isRef(options)) {
    watch([options], fetchData, { deep: true });
  }

  return { data, isLoading, error, execute: fetchData }
}
