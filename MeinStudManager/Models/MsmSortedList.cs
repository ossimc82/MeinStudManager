using System.Collections;
using System.Diagnostics;

namespace MeinStudManager.Models
{
    [DebuggerDisplay("Count = {Count}")]
    [Serializable]
    public class MsmSortedList<T, TComparer> : IList<T>, IReadOnlyList<T> where TComparer : IComparer<T>
    {
        private List<T> _items;

        private IComparer<T> comparer = Activator.CreateInstance<TComparer>();

        public MsmSortedList()
        {
            _items = new List<T>();
        }

        public MsmSortedList(int capacity)
        {
            _items = new List<T>(capacity);
        }

        public MsmSortedList(IEnumerable<T> collection)
        {
            _items = new List<T>(collection);
            _items.Sort(comparer);
        }

        public IEnumerator<T> GetEnumerator()
        {
            return _items.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public void Add(T item)
        {
            _items.Add(item);
            _items.Sort(comparer);
        }

        public void Clear()
        {
            _items.Clear();
        }

        public bool Contains(T item)
        {
            return _items.Contains(item);
        }

        public void CopyTo(T[] array, int arrayIndex)
        {
            _items.CopyTo(array, arrayIndex);
        }

        public bool Remove(T item)
        {
            return _items.Remove(item);
        }

        public int Count => _items.Count;
        int ICollection<T>.Count => _items.Count;

        public bool IsReadOnly { get; } = false;

        public int IndexOf(T item)
        {
            return _items.IndexOf(item);
        }

        public void Insert(int index, T item)
        {
            throw new NotSupportedException("Insert at index is not supported in a sorted list.");
        }

        public void RemoveAt(int index)
        {
            _items.RemoveAt(index);
        }

        public T this[int index]
        {
            get => _items[index];
            set
            {
                _items[index] = value;
                _items.Sort(comparer);
            }
        }

        int IReadOnlyCollection<T>.Count => _items.Count;
    }
}
