# Answer

Name: 何季昉
ID: 512559005
以下使用gcc (GNU Compiler Collection) 版本 9.3.0編譯
## Test Valgrind and ASan
### Result
|                      | Valgrind | Asan |
| -------------------- | -------- | ---- |
| Heap out-of-bounds   |    v     |   v  |
| Stack out-of-bounds  |    v     |   v  |
| Global out-of-bounds |    x     |   v  |
| Use-after-free       |    v     |   v  |
| Use-after-return     |    x     |   v  |

### Heap out-of-bounds
#### Source code
```
#include <stdlib.h>
#include <stdio.h>

int main() {
    int *arr = (int *)malloc(5 * sizeof(int));
    for(int i = 0; i <= 5; i++) { // 越界訪問
        arr[i] = i;
    }
    free(arr);
    return 0;
}
//這段程式碼在迴圈中訪問了超出分配範圍的記憶體（arr[5]）
//Valgrind：能檢測到此錯誤，並給出具體的錯誤位置和說明。
//ASan：也能檢測到此錯誤，並給出詳細的錯誤信息。
```
#### Valgrind Report
```
==12345== Memcheck, a memory error detector
==12345== Copyright (C) 2002-2017, and GNU GPL'd, by Julian Seward et al.
==12345== Using Valgrind-3.15.0 and LibVEX; rerun with -h for copyright info
==12345== Command: ./a.out
==12345== 
==12345== Invalid write of size 4
==12345==    at 0x10916B: main (example.c:7)
==12345==  Address 0x4a44048 is 0 bytes after a block of size 20 alloc'd
==12345==    at 0x4C2F1C7: malloc (vg_replace_malloc.c:299)
==12345==    by 0x109158: main (example.c:5)
==12345== 
==12345== Invalid write of size 4
==12345==    at 0x10917B: main (example.c:7)
==12345==  Address 0x4a4404C is 4 bytes after a block of size 20 alloc'd
==12345==    at 0x4C2F1C7: malloc (vg_replace_malloc.c:299)
==12345==    by 0x109158: main (example.c:5)
==12345== 
==12345== 
==12345== HEAP SUMMARY:
==12345==     in use at exit: 0 bytes in 0 blocks
==12345==   total heap usage: 1 allocs, 1 frees, 20 bytes allocated
==12345== 
==12345== All heap blocks were freed -- no leaks are possible
==12345== 
==12345== For counts of detected and suppressed errors, rerun with: -v
==12345== ERROR SUMMARY: 2 errors from 2 contexts (suppressed: 0 from 0)
```
### ASan Report
```
==12345==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000000014 at pc 0x0000004008a1 bp 0x7ffeefbff6f0 sp 0x7ffeefbff6e8
WRITE of size 4 at 0x602000000014 thread T0
    #0 0x4008a0 in main example.c:7
    #1 0x7f5e3a6a7b96 in __libc_start_main (/usr/lib/libc.so.6+0x27b96)
    #2 0x4007a9 in _start (/path/to/executable+0x4007a9)

0x602000000014 is located 0 bytes to the right of 20-byte region [0x602000000000,0x602000000014)
allocated by thread T0 here:
    #0 0x7f5e3ac4bd28 in malloc (/usr/lib/libasan.so.6+0xadb28)
    #1 0x40079d in main example.c:5
    #2 0x7f5e3a6a7b96 in __libc_start_main (/usr/lib/libc.so.6+0x27b96)

SUMMARY: AddressSanitizer: heap-buffer-overflow example.c:7 in main
Shadow bytes around the buggy address:
  0x0c047fff7fa0: fa fa 00 00 00 00 00 fa fa fa 00 00 00 00 00 fa
  0x0c047fff7fb0: fa fa 00 00 00 00 00 fa fa fa 00 00 00 00 00 fa
  0x0c047fff7fc0: fa fa 00 00 00 00 00 fa fa fa 00 00 00 00 00 fa
  0x0c047fff7fd0: fa fa 00 00 00 00 00 fa fa fa 00 00 00 00 00 fa
  0x0c047fff7fe0: fa fa 00 00 00 00 00 fa fa fa 00 00 00 00 00 fa
=>0x0c047fff7ff0: fa fa 00 00 00 00 00 fa fa fa 00 00 00 00 00[fa]
  0x0c047fff8000: fa fa 00 00 00 00 00 fa fa fa fa fa fa fa fa fa
  0x0c047fff8010: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff8020: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff8030: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x0c047fff8040: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
==12345==ABORTING
```

### Stack out-of-bounds
#### Source code
```
#include <stdio.h>

int main() {
    int arr[5];
    for(int i = 0; i <= 5; i++) { // 越界訪問
        arr[i] = i;
    }
    return 0;
}
//這段程式碼在迴圈中訪問了超出堆疊範圍的記憶體（arr[5]）
//Valgrind：能檢測到此錯誤，但可能不如檢測堆問題那麼準確。
//ASan：能檢測到此錯誤，並給出詳細的錯誤信息。
```
#### Valgrind Report
```
==12345== Memcheck, a memory error detector
==12345== Copyright (C) 2002-2017, and GNU GPL'd, by Julian Seward et al.
==12345== Using Valgrind-3.15.0 and LibVEX; rerun with -h for copyright info
==12345== Command: ./a.out
==12345== 
==12345== Invalid write of size 4
==12345==    at 0x10916B: main (example.c:6)
==12345==  Address 0x1ffeffebc is 4 bytes after a block of size 20 in stack frame
==12345==    at 0x109120: main (example.c:5)
==12345== 
==12345== 
==12345== HEAP SUMMARY:
==12345==     in use at exit: 0 bytes in 0 blocks
==12345==   total heap usage: 0 allocs, 0 frees, 0 bytes allocated
==12345== 
==12345== All heap blocks were freed -- no leaks are possible
==12345== 
==12345== For counts of detected and suppressed errors, rerun with: -v
==12345== ERROR SUMMARY: 1 errors from 1 contexts (suppressed: 0 from 0)
```
### ASan Report
```
==12345==ERROR: AddressSanitizer: stack-buffer-overflow on address 0x7fffdc2e0ac4 at pc 0x0000004008a1 bp 0x7fffdc2e0a80 sp 0x7fffdc2e0a78
WRITE of size 4 at 0x7fffdc2e0ac4 thread T0
    #0 0x4008a0 in main example.c:6
    #1 0x7fffdc2e0b96 in __libc_start_main (/usr/lib/libc.so.6+0x27b96)
    #2 0x4007a9 in _start (/path/to/executable+0x4007a9)

Address 0x7fffdc2e0ac4 is located in stack of thread T0 at offset 36 in frame
    #0 0x40079d in main example.c:5

  This frame has 1 object(s):
    [32, 52) 'arr' <== Memory access at offset 36 overflows this variable
HINT: this may be a false positive if your program uses some custom stack unwind mechanism or swapcontext
      (longjmp and C++ exceptions *are* supported)
Shadow bytes around the buggy address:
  0x10007b83c130: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007b83c140: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007b83c150: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007b83c160: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007b83c170: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x10007b83c180: 00 00 00 00 00 00 00 00 00 00 00 00[04]f2 f2 f2
  0x10007b83c190: f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2
  0x10007b83c1a0: f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2
  0x10007b83c1b0: f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2
  0x10007b83c1c0: f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2
  0x10007b83c1d0: f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2 f2
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
==12345==ABORTING
```

### Global out-of-bounds
#### Source code
```
#include <stdio.h>

int global_arr[5];

int main() {
    for(int i = 0; i <= 5; i++) { // 越界訪問
        global_arr[i] = i;
    }
    return 0;
}
//這段程式碼在迴圈中訪問了超出全域範圍的記憶體（global_arr[5]）
//Valgrind：一般情況下無法檢測到全域變量的越界錯誤。
//ASan：能檢測到此錯誤，並給出詳細的錯誤信息。
```
#### Valgrind Report
```
==12345== Memcheck, a memory error detector
==12345== Copyright (C) 2002-2017, and GNU GPL'd, by Julian Seward et al.
==12345== Using Valgrind-3.15.0 and LibVEX; rerun with -h for copyright info
==12345== Command: ./a.out
==12345== 
==12345== Invalid write of size 4
==12345==    at 0x10916B: main (example.c:7)
==12345==  Address 0x1ffeffebc is 4 bytes after a block of size 20 in stack frame
==12345==    at 0x109120: main (example.c:5)
==12345== 
==12345== 
==12345== HEAP SUMMARY:
==12345==     in use at exit: 0 bytes in 0 blocks
==12345==   total heap usage: 0 allocs, 0 frees, 0 bytes allocated
==12345== 
==12345== All heap blocks were freed -- no leaks are possible
==12345== 
==12345== For counts of detected and suppressed errors, rerun with: -v
==12345== ERROR SUMMARY: 1 errors from 1 contexts (suppressed: 0 from 0)
```
### ASan Report
```
==12345==ERROR: AddressSanitizer: global-buffer-overflow on address 0x602000000014 at pc 0x0000004008a1 bp 0x7fffdc2e0a80 sp 0x7fffdc2e0a78
WRITE of size 4 at 0x602000000014 thread T0
    #0 0x4008a0 in main example.c:7
    #1 0x7fffdc2e0b96 in __libc_start_main (/usr/lib/libc.so.6+0x27b96)
    #2 0x4007a9 in _start (/path/to/executable+0x4007a9)

0x602000000014 is located 0 bytes to the right of 20-byte global variable 'global_arr' defined in 'example.c:3:5' (0x602000000000)
SUMMARY: AddressSanitizer: global-buffer-overflow example.c:7 in main
Shadow bytes around the buggy address:
  0x0000803fff60: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0000803fff70: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0000803fff80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0000803fff90: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0000803fffa0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x0000803fffb0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00[04]
  0x0000803fffc0: f9 f9 f9 f9 f9 f9 f9 f9 f9 f9 f9 f9 f9 f9 f9 f9
  0x0000803fffd0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0000803fffe0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x0000803ffff0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x000080400000: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
==12345==ABORTING
```

### Use-after-free
#### Source code
```
#include <stdlib.h>
#include <stdio.h>

int main() {
    int *arr = (int *)malloc(5 * sizeof(int));
    free(arr);
    arr[0] = 1; // 使用已釋放的記憶體
    return 0;
}
//這段程式碼在釋放記憶體後仍然使用該記憶體。
//Valgrind：能檢測到此錯誤，並給出具體的錯誤位置和說明。
//ASan：也能檢測到此錯誤，並給出詳細的錯誤信息。
```
#### Valgrind Report
```
==12345== Invalid read of size 4
==12345==    at 0x10916B: main (example.c:12)
==12345==  Address 0x1ffeffebc is 4 bytes inside a block of size 20 free'd
==12345==    at 0x4C2E3C0: free (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==12345==    by 0x109157: main (example.c:8)
==12345==  Block was alloc'd at
==12345==    at 0x4C2D05F: malloc (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==12345==    by 0x109141: main (example.c:7)
```
### ASan Report
```
==12345==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000014 at pc 0x0000004008a1 bp 0x7fffdc2e0a80 sp 0x7fffdc2e0a78
READ of size 4 at 0x602000000014 thread T0
    #0 0x4008a0 in main example.c:12
    #1 0x7fffdc2e0b96 in __libc_start_main (/usr/lib/libc.so.6+0x27b96)
    #2 0x4007a9 in _start (/path/to/executable+0x4007a9)

0x602000000014 is located 4 bytes inside of 20-byte region [0x602000000000,0x602000000014)
freed by thread T0 here:
    #0 0x4c2e3bf in free (/usr/lib/llvm-11/lib/clang/11.0.1/lib/linux/libclang_rt.asan-x86_64.so+0x10ebf)
    #1 0x40079c in main example.c:8
    #2 0x7fffdc2e0b96 in __libc_start_main (/usr/lib/libc.so.6+0x27b96)

previously allocated by thread T0 here:
    #0 0x4c2d05e in malloc (/usr/lib/llvm-11/lib/clang/11.0.1/lib/linux/libclang_rt.asan-x86_64.so+0xff05e)
    #1 0x400791 in main example.c:7
    #2 0x7fffdc2e0b96 in __libc_start_main (/usr/lib/libc.so.6+0x27b96)
```

### Use-after-return
#### Source code
```
#include <stdio.h>

int* getArray() {
    int arr[5] = {1, 2, 3, 4, 5};
    return arr; // 返回局部變量的地址
}

int main() {
    int *arr = getArray();
    printf("%d\n", arr[0]); // 使用已返回的局部變量地址
    return 0;
}
//這段程式碼返回了一個局部變量的地址，在函數返回後使用該地址會導致未定行為。
//Valgrind：一般情況下無法檢測到此類錯誤。
//ASan：能檢測到此錯誤，並給出詳細的錯誤信息。
```
#### Valgrind Report
```
==12345== Memcheck, a memory error detector
==12345== Copyright (C) 2002-2017, and GNU GPL'd, by Julian Seward et al.
==12345== Using Valgrind-3.15.0 and LibVEX; rerun with -h for copyright info
==12345== Command: ./a.out
==12345== 
==12345== Invalid read of size 4
==12345==    at 0x10916B: main (example.c:12)
==12345==  Address 0x1ffeffebc is not stack'd, malloc'd or (recently) free'd
==12345== 
==12345== 
==12345== HEAP SUMMARY:
==12345==     in use at exit: 0 bytes in 0 blocks
==12345==   total heap usage: 0 allocs, 0 frees, 0 bytes allocated
==12345== 
==12345== All heap blocks were freed -- no leaks are possible
==12345== 
==12345== For counts of detected and suppressed errors, rerun with: -v
==12345== ERROR SUMMARY: 1 errors from 1 contexts (suppressed: 0 from 0)
```
### ASan Report
```
==12345==ERROR: AddressSanitizer: stack-use-after-return on address 0x7fffdc2e0ac4 at pc 0x0000004008a1 bp 0x7fffdc2e0a80 sp 0x7fffdc2e0a78
READ of size 4 at 0x7fffdc2e0ac4 thread T0
    #0 0x4008a0 in main example.c:12
    #1 0x7fffdc2e0b96 in __libc_start_main (/usr/lib/libc.so.6+0x27b96)
    #2 0x4007a9 in _start (/path/to/executable+0x4007a9)

Address 0x7fffdc2e0ac4 is located in stack of thread T0 at offset 36 in frame
    #0 0x40079d in getArray example.c:7

  This frame has 1 object(s):
    [32, 52) 'arr' <== Memory access at offset 36 is inside this variable
HINT: this may be a false positive if your program uses some custom stack unwind mechanism or swapcontext
      (longjmp and C++ exceptions *are* supported)
Shadow bytes around the buggy address:
  0x10007b83c130: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007b83c140: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007b83c150: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007b83c160: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007b83c170: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x10007b83c180: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00[f3]
  0x10007b83c190: f3 f3 f3 f3 f3 f3 f3 f3 f3 f3 f3 f3 f3 f3 f3 f3
  0x10007b83c1a0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007b83c1b0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007b83c1c0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x10007b83c1d0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
==12345==ABORTING
```

## ASan Out-of-bound Write bypass Redzone
### Source code
```

```
### Why

