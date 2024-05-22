// TODO:
#include <sanitizer/asan_interface.h>

void antiasan(unsigned long addr) {
    size_t size = 1;

    __asan_unpoison_memory_region((void*)addr, size);
}